const express = require('express');
const router = express.Router();
const multer = require('multer');
const{pool,table_name}=require ('../server');
const crypto = require('crypto');

// Function to generate a unique filename
function generateUniqueFilename(originalFilename) {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const filename = `${timestamp}-${randomString}-${originalFilename}`;
  return filename;
}

// Configure multer middleware to handle file uploads

const storage = multer.diskStorage({
  destination: "/Users/speedpowermac/Documents/projects/CODE_MAIN/Term5/InvoiceHub/public/img-db", 
  filename: (req, file, cb) => {
    cb(null,generateUniqueFilename(file.originalname));
  }
});

const upload = multer({ storage });

// POST endpoint to save the image
router.post('/save-image', upload.single('jpeg'), (req, res) => {
    if (!req.file) {
        res.status(400).send('No image file provided.');
        return;
    }
    const imagePath =  req.file.filename; // Replace with the folder path
    res.status(200).json(imagePath);
});

  router.post('/insert-record', async (req, res) => {
    const { user, invoiceid, invoice_name, upload_date, status, path } = req.body;
  
    // Insert the record into the table
    const query = `INSERT INTO ${table_name.invoice} (users, invoiceid, invoice_name, upload_date, status, path) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [user, invoiceid, invoice_name, upload_date, status, path];
    
    try {
      const connection = await pool.getConnection();
      
      const results = await connection.query(query,values);
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

  router.post('/save-detected-text', async (req, res) => {
    const { invoiceid, detectedText } = req.body;

    console.log("Saving detected text for invoice with id:", invoiceid, "Detected Text:", detectedText);
  
    const query = `UPDATE invoices SET detectedText = ? WHERE invoiceid = ?`;
    try {
      const connection = await pool.getConnection();
      const results = await connection.query(query, [detectedText, invoiceid]);
  
      console.log('Detected text saved successfully!');
      res.status(200).json({ message: 'Detected text saved successfully' });
  
      connection.release();
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: 'An error occurred while saving detected text' });
    }
  });

  router.get('/get-detected-text/:invoiceid', async (req, res) => {
    const invoiceId = req.params.invoiceid;
  
    console.log("Requesting detected text for invoice with id:", invoiceId);
  
    const query = `SELECT detectedText FROM invoices WHERE invoiceid = ?`;
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(query, [invoiceId]);
      
      if (rows.length > 0) {
        const detectedTexts = rows.map(row => row.detectedText);
        console.log('Detected texts retrieved successfully:', detectedTexts);
        res.status(200).send(detectedTexts.join('\n')); // Send the detected texts as plain text
      } else {
        console.log('No detected texts found');
        res.status(404).json({ message: 'No detected texts found' });
      }
      connection.release();
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: 'An error occurred while retrieving detected text' });
    }
  });
  

  router.get('/all', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM invoices');
      connection.release();
      res.json(rows);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: 'An error occurred while fetching invoices' });
    }
  });
  
  // router.get('/get-detected-text', async (req, res) => {

  //   const query = `SELECT detectedText FROM invoices`;
  //   try {
  //     const connection = await pool.getConnection();
  //     const [rows] = await connection.query(query);
      
  //     if (rows.length > 0) {
  //       const detectedTexts = rows.map(row => row.detectedText);
  //       console.log('Detected texts retrieved successfully:', detectedTexts);
  //       res.status(200).send(detectedTexts.join('\n')); // Send the detected texts as plain text
  //     } else {
  //       console.log('No detected texts found');
  //       res.status(404).json({ message: 'No detected texts found' });
  //     }
      
  //     connection.release();
  //   } catch (error) {
  //     console.error("Error:", error);
  //     res.status(500).json({ error: 'An error occurred while retrieving detected texts' });
  //   }
  // });
  

  // Export the router
module.exports = router;

