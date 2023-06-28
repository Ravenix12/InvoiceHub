const express = require('express');
const router = express.Router();
const{pool,table_name}=require ('../server');

const accessKeyId = process.env.AWS_accessKeyId;
const secretAccessKey = process.env.AWS_secretAccessKey;
const region = process.env.AWS_region;

const { Rekognition } = require('@aws-sdk/client-rekognition');

const rekognitionClient = new Rekognition({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

const multer = require('multer');
const upload = multer().single('jpeg');

router.post('/upload-jpeg', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error:', err);
      return res.sendStatus(500);
    }
    const jpegData = req.file.buffer;
    console.log("JpegData:", jpegData);
    
    try {
      const params = {
        Image: {
          Bytes: jpegData
        }
      };
      const response = await rekognitionClient.detectText(params);
      // Process the response

      const textDetections = response.TextDetections.filter(detection => detection.Type === 'WORD');
      const detectedTexts = textDetections.map(detection => detection.DetectedText);
      console.log(textDetections);
      console.log('Detected Texts:', detectedTexts);
      res.sendStatus(200);
    } catch (err) {
      console.error('Error:', err);
      res.sendStatus(500);
    }
  });
});


// Export the router
module.exports = router;