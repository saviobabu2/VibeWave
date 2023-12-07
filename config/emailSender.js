const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'saviosbabu@gmail.com', 
    pass: 'lzai wprh bxgz cfzw'
  }
});
module.exports = transporter;