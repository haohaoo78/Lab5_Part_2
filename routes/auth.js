const express = require("express");
const router = express.Router();
const User = require("../models/User");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API xác thực người dùng (Session + Cookie)
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       400:
 *         description: Lỗi đăng ký
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const newUser = new User({ username, password });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ error: "User registered failed", details: err.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập tài khoản
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Sai username hoặc password
 *       500:
 *         description: Lỗi server
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    req.session.userId = user._id;
    res.cookie("sid", req.sessionID, {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      maxAge: 1000 * 60 * 60, // 1h
    });

    res.json({ message: "Logged in!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Login failed", details: err.message });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       500:
 *         description: Lỗi server khi logout
 */
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("sid"); // xoá cookie custom
    res.clearCookie("connect.sid"); // xoá cookie session
    res.json({ message: "Logged out!" });
  });
});

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Lấy thông tin user (cần đăng nhập)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Trả về thông tin user
 *       401:
 *         description: Unauthorized (chưa login)
 */
router.get("/profile", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await User.findById(req.session.userId).select("-password");
  res.json(user);
});

module.exports = router;
