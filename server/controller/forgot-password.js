const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// In-memory database for demonstration
const users = new Map(); // Key: email, Value: { otp, password }

// Configure email transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Use 587 for TLS
    secure: false, // Set to false for TLS
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS // Replace with your email password or app password
    }
});

// 1. Send OTP to email
exports.send_otp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ message: "Email is required." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await UserModel.updateOne({ email }, { otp });

  transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp} to change the password !`
  }, (err) => {
      if (err) {
          console.error("Error sending email:", err);
          return res.status(500).json({ message: "Failed to send OTP." });
      }

      res.json({ message: "OTP sent successfully." });
  });
};

// 2. Verify OTP
exports.verify_otp = async (req, res) => {
    const { otp } = req.body; // Email not required based on your code

    if (!otp) {
        return res.status(400).json({ message: "OTP is required." });
    }

    try {
        const user = await UserModel.findOne({ otp }); // Lookup by OTP

        if (!user) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        // OTP verified successfully
        res.json({ message: "OTP verified successfully." });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// 3. Update password

//main
exports.update_password = async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ message: "Email, password, and confirm password are required." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid email." });
    }

    // Update password
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "Password updated successfully." });
};