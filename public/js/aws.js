
// const AWS = require('aws-sdk');
// const fs = require('fs');


// async function detectTextInImage(imagePath) {
//     console.log("AWS thing is working")
//   // Set the AWS access key ID and secret access key
//   const accessKeyId = 'AKIAQ2N7GDZTUR4GKLOL';
//   const secretAccessKey = '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';
//   const region = 'ap-southeast-1';

//   // Configure AWS credentials
//   AWS.config.update({
//     accessKeyId,
//     secretAccessKey,
//     region
//   });

//   // Create a Rekognition client
//   const rekognition = new AWS.Rekognition();

//   try {
//     // Read the image file
//     const image = fs.readFileSync(imagePath);

//     // Detect text in the image
//     const params = {
//       Image: {
//         Bytes: image
//       }
//     };

//     const data = await rekognition.detectText(params).promise();

//     // Process the response
//     const textDetections = data.TextDetections;
//     textDetections.forEach(textDetection => {
//       const detectedText = textDetection.DetectedText;
//       const confidence = textDetection.Confidence;
//       console.log(`Detected Text: ${detectedText}, Confidence: ${confidence}`);
//     });
//   } catch (err) {
//     console.error('Error:', err);
//   }
// }

// // Usage example
// const imagePath = '/path/to/image.jpg';
// detectTextInImage(imagePath);
