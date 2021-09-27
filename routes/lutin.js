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

router.get("/info/:id", verifyToken, (req, res, next) => {
  const id = req.params.id;
  const sql = "SELECT lutin_content FROM lutins WHERE lutin_id = ?";
  con.query(sql, [id], (err, data) => {
    if (data.length <= 0) {
      res.status(400).json({
        error: "데이터가 없거나 불러올 수 없습니다!",
      });
      return;
    }

    res.status(200).json({
      success: "루틴 상세정보를 불러옵니다.",
      data: data[0].lutin_content,
    });
  });
});

router.post("/delete/:id", verifyToken, (req, res, next) => {
  const id = req.params.id;
  const sql = "DELETE FROM lutins WHERE lutin_id = ?";
  con.query(sql, [id], (err, data) => {
    if (err) {
      res.status(400).json({
        error: "루틴 제거를 실패했습니다",
      });
      return;
    }

    res.status(200).json({
      success: "루틴을 성공적으로 제거했습니다",
    });
  });
});

module.exports = router;
