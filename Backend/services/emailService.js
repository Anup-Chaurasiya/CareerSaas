// Create services/emailService.js
const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"CareerSaaS" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

// Template emails
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to CareerSaaS!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to CareerSaaS, ${user.name}!</h2>
      <p>We're excited to help you advance your career with our AI-powered tools.</p>
      <p>Get started by uploading your resume for analysis or explore our premium features.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">Go to Dashboard</a>
      <p style="margin-top: 30px;">Best regards,<br/>The CareerSaaS Team</p>
    </div>
  `;
  
  return sendEmail(user.email, subject, html);
};

const sendResumeAnalyzedEmail = async (user, resume) => {
  const subject = 'Your resume has been analyzed!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Resume Analysis Complete</h2>
      <p>Your resume <strong>${resume.name}</strong> has been analyzed with a score of <strong>${resume.score}/100</strong>.</p>
      <p>View detailed feedback and suggestions to improve your resume.</p>
      <a href="${process.env.FRONTEND_URL}/resume/${resume._id}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">View Results</a>
      <p style="margin-top: 30px;">Best regards,<br/>The CareerSaaS Team</p>
    </div>
  `;
  
  return sendEmail(user.email, subject, html);
};

const sendSubscriptionConfirmation = async (user, subscription) => {
  const planNames = {
    free: 'Free Plan',
    basic: 'Basic Plan',
    pro: 'Pro Plan',
    business: 'Business Plan'
  };
  
  const subject = 'Subscription Confirmation';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Thank you for your subscription!</h2>
      <p>You have successfully subscribed to our <strong>${planNames[subscription.plan]}</strong>.</p>
      <p>Your subscription is active and you now have access to all premium features.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">Access Premium Features</a>
      <p style="margin-top: 30px;">Best regards,<br/>The CareerSaaS Team</p>
    </div>
  `;
  
  return sendEmail(user.email, subject, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendResumeAnalyzedEmail,
  sendSubscriptionConfirmation
};