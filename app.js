const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware đọc JSON từ request body
app.use(express.json());
app.use(cookieParser());

// Kết nối MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/sessionAuth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Session middleware
app.use(
  session({
    secret: "mysecretkey", // nên để biến môi trường ENV
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/sessionAuth",
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      maxAge: 1000 * 60 * 60, // 1 hour 
    }, // 1 giờ
  })
);

// Sử dụng route auth
app.use("/auth", authRoutes);

// Chạy server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
