import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1) Create a transporter object using Gmail's recommended settings
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use the built-in Gmail service for simplicity
    host: process.env.SMTP_HOST, // Still good to have for reference
    port: process.env.SMTP_PORT,
    secure: true, // Gmail uses SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS, // This MUST be the 16-character App Password
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: `Learnify <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3) Actually send the email and get info for debugging
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s'.green, info.messageId);
    // You can uncomment the next line to see the full response from Gmail
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    // This will now log the exact error from nodemailer if it fails
    console.error('Email sending failed with error:'.red.bold, err);
    // We re-throw the error so the controller knows it failed
    throw new Error('Email could not be sent.');
  }
};

export default sendEmail;