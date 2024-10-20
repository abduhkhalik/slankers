const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const cors = require("cors");
const requestTime = require("./middleware/requesTime");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
dotenv.config();

// Koneksi ke database MongoDB
mongoose
  .connect(process.env.MONGO_BASE_URL, {
  }) // Penambahan useNewUrlParser untuk menghindari deprecated warning
  .then(() => console.log("Database Connected!!"))
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

// Middleware untuk menambahkan waktu permintaan
app.use(function (req, res, next) {
  res.setHeader("Content-Security-Policy", "script-src 'self'");
  return next();
});
app.use(requestTime);

// Router untuk endpoint-endpoint aplikasi
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

const PORT = process.env.PORT || 8000; // Menggunakan PORT dari environment jika tersedia, atau default 8000
app.listen(PORT, () => {
  console.log(`Server Berjalan Di Port ${PORT}`);
});
