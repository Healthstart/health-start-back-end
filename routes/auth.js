const express = require("express");
const router = express.Router();
const con = require("../db/mysql");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  const insertSQL = `INSERT INTO users(email, password, name) VALUES(?, hex(aes_encrypt(?, '${process.env.DB_ENCRYPT}')), ?)`;
  const checkSQL = `SELECT * FROM users WHERE email=?`;
  console.log(req.body);
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    console.log(req.body);
    res.status(400).json({ error: "데이터가 올바르지 않습니다." });
    return;
  }

  con.query(checkSQL, [email], (err, data) => {
    console.log(data);
    if (data.length > 0) {
      res.status(400).json({ error: "동일한 이메일이 이미 존재합니다." });
      return;
    }

    con.query(insertSQL, [email, password, username], (err, data) => {
      if (err) throw err;
      res.json({ success: "성공적으로 가입이 완료되었습니다." });
    });
  });
});

const createToken = (email) => {
  return jwt.sign(
    {
      email,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1h",
    }
  );
};

router.post("/login", (req, res) => {
  const checkSQL = `SELECT * FROM users WHERE email=?`;
  const compareSQL = `SELECT password FROM users WHERE password=hex(aes_encrypt(?, '${process.env.DB_ENCRYPT}'))`;

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "데이터가 올바르지 않습니다." });
    return;
  }

  con.query(checkSQL, [email], (err, data) => {
    if (data.length <= 0) {
      res
        .status(400)
        .json({ error: "이메일 혹은 비밀번호가 올바르지 않습니다." });
      return;
    }

    con.query(compareSQL, [password], (err, data) => {
      if (data.length <= 0) {
        res
          .status(400)
          .json({ error: "이메일 혹은 비밀번호가 올바르지 않습니다." });
        return;
      }

      const token = createToken(email);

      res.cookie("token", token);
      res.status(201).json({ success: "성공적으로 로그인 되었습니다.", token });
    });
  });
});

module.exports = router;
