const multer = require('multer'); // For handling file uploads
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const upload = multer();
const table_name ={ login:"users" ,main:"placeHolder",delete_flag:"account_flag",images:"Images"};

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

app.post('/check-account', async (req, res) => {
  const { user } = req.body;
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
      // Sql Rule to make this work < ignore for now >
    //DELIMITER //

    // CREATE TRIGGER delete_user_trigger
    // AFTER DELETE ON account_flag
    // FOR EACH ROW
    // BEGIN
    //   DELETE FROM users WHERE user = OLD.name;
    // END //
    // DELIMITER ;
    // res.status(200).json({ exists: true }); THIS LINE CRASHES WHEN EXECUTED 
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


app.post('/signup', async (req, res) => {
  const { name, password, email, userType } = req.body;

  console.log("Validating signup with name:", name, "password:", password, "email:", email, "and userType:", userType);

  const default_access = "guest";
  const query = `INSERT INTO ${table_name.login} (user, password, email, mode) VALUES (?, ?, ?, ?)`;

  try {
    const connection = await pool.getConnection();

    connection.query(query, [name, password, email, default_access], (err, results) => {
      if (err) {
        console.error('Error occurred during signup:', err);
        res.status(500).json({ error: 'An error occurred during signup' });
      } else {
        console.log('Signup successful!');
        res.status(200).json({ message: 'Signup successful' });
      }

      connection.release();
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// // Route for handling image upload and SQL operation
// app.post('/upload', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No image file found.');
//   }

//   // Get the image data as a base64-encoded string
//   const imageSrc = req.file.buffer.toString('base64');

//   // Execute SQL statement with the image data
//   const sqlStatement = `INSERT INTO Images (image_data) VALUES ('${imageSrc}');`;
//   connection.query(sqlStatement, (error, results) => {
//     if (error) {
//       console.error('Error executing SQL statement:', error);
//       return res.status(500).send('Error executing SQL statement.');
//     }

//     // SQL operation successful
//     console.log('Image uploaded and saved to database.');

//     // Send a success response to the client
//     res.status(200).send('Image uploaded successfully.');
//   });
// });

// // Assuming you have set up your server and route handling
// app.get('/displayImage', (req, res) => {
//   // Retrieve the image data from the database (replace this with your own logic)
//   connection.query(`SELECT image_data FROM ${table_name.image} WHERE id = ?`, [2], (error, results) => {
//     if (error) {
//       console.error('Error retrieving image data:', error);
//       return res.status(500).send('Error retrieving image data.');
//     }

//     if (results.length === 0 || !results[0].image_data) {
//       return res.status(404).send('Image data not found.');
//     }

//     // Convert the image data to base64
//     const imageSrc = results[0].image_data.toString('base64');

//     // Send the image source to the client
//     res.status(200).send(imageSrc);
//   });
// });


app.use(express.static('public'));

// Start the server on port 3001 (or another port of your choice)
app.listen(3000,'0.0.0.0', () => {
    console.log('Server listening on port 3000');
});





app.post('/check-account', async (req, res) => {
  const { user } = req.body;
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