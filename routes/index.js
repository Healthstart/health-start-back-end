const express = require("express");
const router = express.Router();
const con = require("../db/mysql");
const verifyToken = require("./middlewares/authorization");

router.get("/profile", verifyToken, (req, res, next) => {
  const sql = "SELECT name, sub_date FROM users WHERE email=?";
  con.query(sql, [res.locals.email], (err, data) => {
    const { name, sub_date } = data[0];
    res.json({
      success: "프로필을 불러옵니다",
      data: { name, sub_date },
    });
  });
});

module.exports = router;
