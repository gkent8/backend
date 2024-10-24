const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
require("dotenv").config();

// Registration route
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      firstname,
      lastname,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("username in login route", username);
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and return JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("token", token);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
    console.error("Error:", error);
  }
});

// use to get the username
// when logging in you can store user id and username which can be accessed in the frontend
// don't use async but useState
// router.get("/user", async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id); // Get user by ID from token
//     if (!useSafeAreaFrame) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({
//       username: user.username,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

//will need put endpoint to edit profile

module.exports = router;
