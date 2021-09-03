var express = require("express");
var router = express.Router();
const con = require("../db/mysql");

router.post("/register", (req, res) => {
  const insertSQL = `INSERT INTO users(email, password, name) VALUES(?, hex(aes_encrypt(?, '${process.env.DB_ENCRYPT}')), ?)`;
  const checkSQL = `SELECT * FROM users WHERE email=?`;

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.json({ error: "데이터가 올바르지 않습니다." });
    return;
  }

  con.query(checkSQL, [email], (err, data) => {
    if (data.length > 0) {
      res.json({ error: "동일한 이메일이 이미 존재합니다." });
      return;
    }

    con.query(insertSQL, [email, password, name], (err, data) => {
      if (err) throw err;
      res.json({ success: "성공적으로 가입이 완료되었습니다." });
    });
  });
});

router.post("/login", (req, res) => {
  const checkSQL = `SELECT * FROM users WHERE email=?`;
  const compareSQL = `SELECT password FROM users WHERE password=hex(aes_encrypt(?, '${process.env.DB_ENCRYPT}'))`;

  const { email, password } = req.body;

  if (!email || !password) {
    res.json({ error: "데이터가 올바르지 않습니다." });
    return;
  }

  con.query(checkSQL, [email], (err, data) => {
    if (data.length <= 0) {
      res.json({ error: "존재하지 않는 이메일입니다." });
      return;
    }

    con.query(compareSQL, [password], (err, data) => {
      if (data.length <= 0) {
        res.json({ error: "비밀번호가 올바르지 않습니다." });
        return;
      }

      /* Login API */
      res.json({ success: "성공적으로 로그인 되었습니다." });
    });
  });
});

module.exports = router;
