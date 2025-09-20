const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Định nghĩa schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
});

// Hash mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // chỉ hash nếu password thay đổi
  try {
    const salt = await bcrypt.genSalt(10); // 10 vòng salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Hàm so sánh mật khẩu khi login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export model
module.exports = mongoose.model("User", userSchema);
