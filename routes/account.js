const express = require('express');
const router = express.Router();
const{pool,table_name}=require ('../server');
//  This is the route container for everything account related 

router.post('/login', async (req, res) => {
  /**
 * Handles the login API endpoint.
 * Retrieves user data from the database based on the provided username and password.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
*/
  const { username, password } = req.body;
  const sqlData = `SELECT * FROM ${table_name.login} WHERE user=? AND password=?`;
  
  try {
    const connection = await pool.getConnection();
    
    // Execute the SQL query to retrieve user data
    const [rows] = await connection.query(sqlData, [username, password]);
    
    // Send the retrieved user data as a response
    res.json(rows);
    
    // Release the database connection
    connection.release();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/elevate-privilege', async (req, res) => {
  /**
 * Handles the elevate-privilege API endpoint.
 * Checks if a user exists in the database and elevates their privilege if not.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
*/
  const { user } = req.body;
  const flag = 0;
  const checkQuery = `SELECT COUNT(*) AS count FROM ${table_name.handle_privilege} WHERE user = ?`;
  const insertQuery = `INSERT INTO ${table_name.handle_privilege} (flag,user) VALUES (?,?) ON DUPLICATE KEY UPDATE user = user`;
  
  try {
    const connection = await pool.getConnection();
    
    // Check if the user already exists in the handle_privilege table
    const [rows] = await connection.query(checkQuery, [user]);
    const count = rows[0].count;
    
    if (count > 0) {
      // User exists, send response indicating existence
      res.status(200).json({ exists: true });
    } else {
      // Account doesn't exist, elevate privilege by inserting the record
      console.log("Elevating privilege for the account");
      await connection.query(insertQuery, [flag, user]);
    }
    
    // Release the database connection
    connection.release();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/check-requests', async (req, res) => {
  /**
 * Handles the check-requests API endpoint.
 * Retrieves the ID and user fields from the handle_privilege table where flag is 0.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
*/
  try {
    const connection = await pool.getConnection();
    
    // Select records from the handle_privilege table where flag is 0
    const selectQuery = `SELECT id, user FROM ${table_name.handle_privilege} where flag=0`;
    const [rows] = await connection.query(selectQuery);
    
    // Release the database connection
    connection.release();
    
    // Send the retrieved records as a response
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/check-privilege', async (req, res) => {
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

router.delete('/clear-privilege', async (req, res) => {
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

router.post('/signup', async (req, res) => {
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

router.post('/check-account', async (req, res) => {
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
// -1 -> Declined
router.post('/respond-request', async (req, res) => {
  /**
  * Handles the POST request to respond to a privilege elevation request.
  * Updates the privilege elevation flag and the user mode based on the provided action.
  * @param {Request} req - The request object containing the user and action information.
  * @param {Response} res - The response object to send the result back to the client.
  */
  const { user, action } = req.body;

  try {
    const connection = await pool.getConnection();

    if (action === 'accept') {
      // Retrieve the user from the elevate privileges table
      const updateFlag = `UPDATE ${table_name.handle_privilege} SET flag = ? WHERE user = ?`;
      await connection.query(updateFlag, [1, user]);

      // Update the main table and set the mode to 'admin' for the specific user
      const updateQuery = `UPDATE ${table_name.login} SET mode = 'admin' WHERE user = ?`;
      await connection.query(updateQuery, [user]);

    } else if (action === 'decline') {
      const updateFlag = `UPDATE ${table_name.handle_privilege} SET flag = ? WHERE user = ?`;
      await connection.query(updateFlag, [-1, user]);

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

// Export the router
module.exports = router;