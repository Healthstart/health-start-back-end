const express = require("express");
const router = express.Router();
const con = require("../db/mysql");
const verifyToken = require("./middlewares/authorization");

router.get("/preview", verifyToken, (req, res, next) => {
  const sql =
    "SELECT lutin_id, lutin_name, lutin_index, view_count FROM lutins WHERE email = ?";
  con.query(sql, [res.locals.email], (err, data) => {
    res.status(200).json({
      success: "루틴 미리보기를 불러옵니다",
      data,
    });
  });
});

module.exports = router;
