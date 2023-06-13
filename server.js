const multer = require('multer'); // For handling file uploads
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const table_name ={ login:"users" ,main:"placeHolder",delete_flag:"account_flag",images:"Images",handle_privilege:"account_elev"};

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
pool.on('error', (err) => {
  console.error('Error in MySQL connection pool:', err);
});

// Use middleware to parse HTTP POST request data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/index/login', async (req, res) => {
  const { username, password } = req.body;
  const sqlData = `SELECT * FROM ${table_name.login} WHERE user=? AND password=?`;

  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.query(sqlData, [username, password]);

    res.json(rows);

    connection.release();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.post('/check-account', async (req, res) => {
//   const { user } = req.body;
//   const checkQuery = `SELECT COUNT(*) AS count FROM ${table_name.delete_flag} WHERE name = ?`;
//   const insertQuery = `INSERT INTO ${table_name.delete_flag} (name) VALUES (?)`;
//   const deleteQuery = `DELETE FROM ${table_name.delete_flag} WHERE name = ?`;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query(checkQuery, [user]);
//     const count = rows[0].count;
//     if (count > 0) {
//       console.log("Account exists and the record is deleted");
//       await connection.query(deleteQuery, [user]);
//   } else {
//     // Account doesn't exist, add it to the SQL table
//     console.log("Adding account to account_flag");
//     await connection.query(insertQuery, [user]);
//     res.status(200).json({ exists: false });
//   }
//     connection.release();
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.post('/elevate-privilege', async (req, res) => {
  const { user } = req.body;
  const flag = 0;
  const checkQuery = `SELECT COUNT(*) AS count FROM ${table_name.handle_privilege} WHERE user = ?`;
  const insertQuery = `INSERT INTO ${table_name.handle_privilege} (flag,user) VALUES (?,?) ON DUPLICATE KEY UPDATE user = user`;
 
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(checkQuery, [user]);
    const count = rows[0].count;

    if (count > 0) {

      res.status(200).json({ exists: true });
    } else {
      // Account doesn't exist, elevate privilege by inserting the record
      console.log("Elevating privilege for the account");
      await connection.query(insertQuery, [flag,user]);
    }
    connection.release();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/check-requests', async (req, res) => {
  
  try {
    const connection = await pool.getConnection();
    const selectQuery = `SELECT id, user FROM ${table_name.handle_privilege} where flag=0`;
    const [rows] = await connection.query(selectQuery);
    connection.release();

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/check-privilege', async (req, res) => {
  const { user } = req.query;

  try {
    const connection = await pool.getConnection();
    const selectQuery = `SELECT * FROM ${table_name.handle_privilege} WHERE user = ?`;
    const [rows] = await connection.query(selectQuery, [user]);
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.delete('/clear-privilege', async (req, res) => {
  const { user } = req.query;

  try {
    const connection = await pool.getConnection();
    const deleteQuery = `DELETE FROM ${table_name.handle_privilege} WHERE user = ?`;
    const [result] = await connection.query(deleteQuery, [user]);
    connection.release();

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Privilege cleared successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





// app.post('/approve-request', async (req, res) => {
//   const { requestId } = req.body;

//   try {
//     const connection = await pool.getConnection();

//     // Retrieve the user from the elevate privileges table
//     const selectQuery = `SELECT user FROM ${table_name.handle_privilege} WHERE id = ?`;
//     const [rows] = await connection.query(selectQuery, [requestId]);
//     const user = rows[0].user;

//     // Update the main table and set the mode to 'admin' for the specific user
//     const updateQuery = `UPDATE ${table_name.login} SET mode = 'admin' WHERE user = ?`;
//     await connection.query(updateQuery, [user]);

//     // Delete the request from the elevate privileges table
//     const deleteQuery = `DELETE FROM ${table_name.handle_privilege} WHERE id = ?`;
//     await connection.query(deleteQuery, [requestId]);

//     connection.release();

//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.post('/signup', async (req, res) => {
  const { name, password, email, userType } = req.body;

  console.log("Validating signup with name:", name, "password:", password, "email:", email, "and userType:", userType);

  const default_access = "guest";
  const query = `INSERT INTO ${table_name.login} (user, password, email, mode) VALUES (?, ?, ?, ?)`;

  try {
    const connection = await pool.getConnection();

    const results = await connection.query(query, [name, password, email, default_access]);

    console.log('Signup successful!');
    res.status(200).json({ message: 'Signup successful' });

    connection.release();
  } catch (error) {
    console.error("Error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Duplicate entry', field: 'user' });
    } else {
      res.status(500).json({ error: 'An error occurred during signup' });
    }
  }
});

app.use(express.static('public'));

// Start the server on port 3001 (or another port of your choice)
app.listen(3000,'0.0.0.0', () => {
    console.log('Server listening on port 3000');
});

app.post('/check-account', async (req, res) => {
  const { user } = req.body;
  console.log(user);
  const checkQuery = `SELECT COUNT(*) AS count FROM ${table_name.delete_flag} WHERE name = ?`;
  const insertQuery = `INSERT INTO ${table_name.delete_flag} (name) VALUES (?)`;
  const deleteQuery = `DELETE FROM ${table_name.delete_flag} WHERE name = ?`;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(checkQuery, [user]);
    const count = rows[0].count;
    if (count > 0) {
      // Account exists, delete the record
      console.log("Account exists and the record is not touched");
      await connection.query(deleteQuery, [user]);
    // res.status(200).json({ exists: true }); THIS LINE CRASHES WHEN EXECUTED 
    try {
      res.status(200).json({ exists: true });
    } catch (jsonError) {
      console.error("JSON Error:", jsonError);
    }
  } else {
    // Account doesn't exist, add it to the SQL table
    console.log("Adding account to account_flag");
    await connection.query(insertQuery, [user]);
    res.status(200).json({ exists: false });
  }
    connection.release();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Account Elev Flags
// 0 -> Requested
// 1 -> Accepted 
// -1 -> declined
app.post('/respond-request', async (req, res) => {
  const { user, action } = req.body;
  try {
    const connection = await pool.getConnection();

    if ( action == 'accept') {
      // Retrieve the user from the elevate privileges table
      const updateFlag = `UPDATE ${table_name.handle_privilege} set flag= ? WHERE user = ?`;
      await connection.query(updateFlag, [1,user]);


      // Update the main table and set the mode to 'admin' for the specific user
      const updateQuery = `UPDATE ${table_name.login} SET mode = 'admin' WHERE user = ?`;
      await connection.query(updateQuery, [user]);

    } else if (action == 'decline') {
      const updateFlag = `UPDATE ${table_name.handle_privilege} set flag= ? WHERE user = ?`;
      await connection.query(updateFlag, [-1,user]);
    } else {
      // Invalid action
      return res.status(400).json({ error: 'Invalid action' });
    }

    connection.release();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
