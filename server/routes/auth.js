const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// ========================================
// REGISTER
// POST /api/auth/register
// ========================================

router.post("/register", async (req, res) => {
  try {

    const {
      name,
      email,
      password
    } = req.body;


    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }


    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters."
      });
    }


    // Normalize email
    const normalizedEmail =
      email.trim().toLowerCase();


    // Check if email already exists
    const existingUser =
      await User.findOne({
        email: normalizedEmail
      });


    if (existingUser) {
      return res.status(409).json({
        message:
          "An account with this email already exists."
      });
    }


    // Hash password
    const passwordHash =
      await bcrypt.hash(password, 12);


    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash
    });


    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );


    // Send response
    res.status(201).json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    res.status(500).json({
      message:
        "Something went wrong during registration."
    });
  }
});



// ========================================
// LOGIN
// POST /api/auth/login
// ========================================

router.post("/login", async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;


    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required."
      });
    }


    // Find user
    const user =
      await User.findOne({
        email: email.trim().toLowerCase()
      });


    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password."
      });
    }


    // Compare password
    const passwordMatches =
      await bcrypt.compare(
        password,
        user.passwordHash
      );


    if (!passwordMatches) {
      return res.status(401).json({
        message:
          "Invalid email or password."
      });
    }


    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );


    // Send response
    res.json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      message:
        "Something went wrong during login."
    });
  }
});


module.exports = router;