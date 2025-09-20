const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ========== REGISTER ==========
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const newUser = new User({ username, password });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "User registered failed", details: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    req.session.userId = user._id;
    res.cookie('sid', req.sessionID,{
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      maxAge: 1000 * 60 * 60, // 1 hour 
    }) 
    // lưu user vào session
    res.json({ message: "Logged in!" });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});


// ========== LOGOUT ==========
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("sid"); // xoá cookie custom
    res.clearCookie("connect.sid"); // xoá cookie session
    res.json({ message: "Logged out!" });
  });
});



// ========== PROFILE (Protected) ==========
router.get("/profile", async(req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await User.findById(req.session.userId).select('-password');
  res.json(user)
});

module.exports = router;
