// const AWS = require("aws-sdk");

// const aws_config = {
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_KEY,
//   region: process.env.AWS_REGION,
// };

// const S3 = new AWS.S3(aws_config);

// const uploadFile = (userId, file) => {
//   const key = `user_images/${userId}`;
//   const uploadParams = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: key,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   return S3.upload(uploadParams).promise();
// };

// exports.uploadFile = uploadFile;
