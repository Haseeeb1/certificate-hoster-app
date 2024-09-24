const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET;
router.use(cookieParser());

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any service like Mailgun, SendGrid, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.MAIL_PASSWORD, // Your email password or app password
  },
});

// Helper function to send verification email
async function sendVerificationEmail(userEmail, verificationCode) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Verify your email",
    text: `Your verification code is: ${verificationCode}`,
  };

  await transporter.sendMail(mailOptions);
  console.log("hello");
}

// Generate a random 6-digit code
function generateVerificationCode() {
  return crypto.randomInt(100000, 999999).toString();
}

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const verificationCode = generateVerificationCode();

    // Create a new user
    user = new User({
      name,
      email,
      password, // Password is hashed in the User model
      verificationCode,
      isVerified: false,
    });

    // Save the user to the database
    await user.save();
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      msg: "User registered. A verification code has been sent to your email.",
      name: name,
      email: email,
      id: user._id,
    });
    // // Generate JWT token
    // const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // // Set cookie with token
    // res.cookie("token", token, {
    //   httpOnly: false,
    //   // Set to true if in production
    //   maxAge: 4 * 24 * 60 * 60 * 1000, // 7 days
    // });

    // res.status(201).json({
    //   msg: "User registered and logged in successfully",
    //   name: name,
    //   email: email,
    //   id: user._id,
    // });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Resend verification code
router.post("/resend-code", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  // Generate a new verification code
  user.verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  await user.save();

  // Send email
  // const mailOptions = {
  //   from: process.env.EMAIL_USER,
  //   to: email,
  //   subject: "Verification Code",
  //   text: `Your verification code is ${user.verificationCode}`,
  // };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - Cert-Vault",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50; text-align: center;">Welcome to Cert-Vault!</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">Dear User,</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Thank you for signing up. To complete your registration, please verify your email address by using the verification code below:</p>
        <div style="text-align: center; margin: 20px 0;">
          <p style="font-size: 24px; font-weight: bold; background-color: #f4f4f4; padding: 10px 20px; display: inline-block; border-radius: 5px;">
            ${user.verificationCode}
          </p>
        </div>
        <p style="font-size: 16px;">If you didn’t request this, you can ignore this email.</p>
        <p style="font-size: 16px;">Best regards,<br />The Cert-Vault Team</p>
        <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #888;">
          <p>&copy; 2024 Cert-Vault.</p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ msg: "Error sending email" });
    }
    res.status(200).json({ msg: "Verification code sent" });
  });
});

// Verify email route
router.post("/verify-email", async (req, res) => {
  const { email, code } = req.body;
  console.log(email);
  try {
    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Check if the verification code matches
    if (user.verificationCode !== code) {
      return res.status(400).json({ msg: "Invalid verification code" });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationCode = null; // Clear the verification code after verification
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: false,
      maxAge: 4 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    res.status(200).json({
      msg: "Email verified successfully",
      name: user.name,
      email: user.email,
      id: user._id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    // Compare the password

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      // If not verified, send a response that prompts for a 6-digit code
      return res.status(400).json({
        msg: "Please verify your email before logging in.",
        email: user.email, // Send the email so frontend can trigger the verification flow
        requireVerification: true, // Include this flag to indicate verification is needed
      });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: false,
      maxAge: 4 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    res.status(200).json({
      msg: "Login successful",
      name: user.name,
      email: user.email,
      id: user._id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
