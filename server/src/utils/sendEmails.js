import nodemailer from 'nodemailer';

// Main email sending function
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Email Transporter Error:", error);
      } else {
        console.log("✅ Email transporter is ready");
      }
    });

    const mailOptions = {
      from: `"Student Portal" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text,
      ...(html && { html }),
    };

    await transporter.sendMail(mailOptions);
    console.log(`📨 Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
};

export default sendEmail;
