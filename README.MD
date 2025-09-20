# Bài tập 2 - Session & Cookie Authentication với Node.js

## Hướng dẫn
Bài tập này dựa theo video:  
[Using Postman to test Session and Cookie in Node JS - Nam Media](https://www.youtube.com/watch?v=xxxxxxxx)

Ứng dụng được xây dựng bằng **Node.js + Express + MongoDB** và sử dụng:
- `express-session` để quản lý session
- `connect-mongo` để lưu session vào MongoDB
- `cookie-parser` để thao tác với cookie
- `bcryptjs` để mã hóa mật khẩu

---

## Cài đặt

1. Clone project về:
   ```bash
   git clone https://github.com/haohaoo78/Lab5_Part_2.git
   cd <tên-thư-mục>

Cài đặt dependencies:
npm install
Tạo file .env trong thư mục gốc:

env
Copy code
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/session_Auth
SESSION_SECRET=your_secret_key

Chạy ứng dụng:
node app.js
Server sẽ chạy tại: http://localhost:3000

Cấu trúc thư mục
.
├── app.js
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── package.json
├── .env
└── README.md