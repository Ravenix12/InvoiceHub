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


// Export the router
module.exports = router;

