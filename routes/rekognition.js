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
const AWS = require('aws-sdk');
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


// Create an S3 client
const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region
});

router.post('/upload-jpeg-bucket', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error:', err);
      return res.sendStatus(500);
    }

    const jpegData = req.file.buffer;
    console.log("JpegData:", jpegData);

    try {
      // Upload the image to S3 bucket
      const uploadParams = {
        Bucket: 'imagebucket1234', // Replace with your bucket name
        Key: 'image.jpg', // Specify the desired key for the uploaded image
        Body: jpegData
      };

      const uploadResult = await s3.upload(uploadParams).promise();
      console.log('Image uploaded to S3:', uploadResult.Location);

      // Use the uploaded image for text detection with AWS Rekognition
      const rekognitionParams = {
        Image: {
          S3Object: {
            Bucket: 'imagebucket1234', // Replace with your bucket name
            Name: 'image.jpg' // Specify the key of the uploaded image
          }
        }
      };
      const rekognitionResponse = await rekognitionClient.detectText(rekognitionParams);
      // Process the response
      const textDetections = rekognitionResponse.TextDetections.filter(detection => detection.Type === 'WORD');
      const detectedTexts = textDetections.map(detection => detection.DetectedText);
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