const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const table_name ={ login:"users" ,main:"placeHolder"};

// Set up a MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});


// Use middleware to parse HTTP POST request data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Validate the username and password if needed
    
    // Return "guru" as the response
    res.json('guru');
  });

  app.post('/api/index/login', (req, res) => {
    const { username, password } = req.body;
    const sqlData = `SELECT * FROM ${table_name.login} WHERE user='${username}' AND password='${password}'`;
    connection.query(sqlData, (error, dataResults, fields) => {
        if (error) throw error;
        res.json(dataResults);
    });
});



  
app.use(express.static('public'));

// Start the server on port 3001 (or another port of your choice)
app.listen(3000,'0.0.0.0', () => {
    console.log('Server listening on port 3000');
});
