const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register User
router.post("/register", async (req, res) => {
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    // Create new user instance
    const newUser = new User({
      username: req.body.username,
      password: hashedPass,
    });

    // Save user to database
    const user = await newUser.save();

    // Remove password from response
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({ username: req.body.username });

    // If user not found, return error
    if (!user) {
      return res.status(400).json("Username or Password is incorrect");
    }

    // Validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json("Username or Password is incorrect");
    }

    // Remove password from response
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

module.exports = router;
