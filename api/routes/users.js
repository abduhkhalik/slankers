const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");

// Create User
router.post("/", async (req, res) => {
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save user to database
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update User
router.put("/:id", async (req, res) => {
  try {
    // Ensure userId from body matches parameter id
    if (req.body.userId !== req.params.id) {
      return res.status(401).json("Kamu Hanya Bisa Update Akun Mu");
    }

    // If there's a new password, hash the password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    // Update user using findByIdAndUpdate
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete User
router.delete("/:id", async (req, res) => {
  try {
    // Ensure userId from body matches parameter id
    if (req.body.userId !== req.params.id) {
      return res.status(401).json("Kamu Hanya Bisa Hapus Akun Mu");
    }

    // Find user by id
    const user = await User.findById(req.params.id);

    // Delete all posts by the user
    await Post.deleteMany({ username: user.username });

    // Delete user based on id
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json("User Berhasil Di Hapus");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get User by Id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // If user is not found
    if (!user) {
      return res.status(404).json("User Tidak Ditemukan");
    }

    // Remove password from response
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
