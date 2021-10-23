const express = require("express");
const router = express.Router();
const con = require("../db/mysql");
const verifyToken = require("./middlewares/authorization");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM posts";

  con.query(sql, [], (err, data) => {
    res.status(200).json({
      success: "모든 포스트를 불러왔습니다",
      data,
    });
  });
});

router.get("/me", verifyToken, (req, res) => {
  const sql = "SELECT * FROM posts WHERE email = ?";

  con.query(sql, [res.locals.email], (err, data) => {
    if (err) {
      res.status(400).json({
        error: "알수 없는 에러",
      });
    }

    res.status(200).json({
      success: "유저의 포스트를 불러왔습니다",
      data,
    });
  });
});

router.post("/", verifyToken, (req, res, next) => {
  const sql = "INSERT INTO posts(poster, title, content) VALUES(?, ?, ?)";
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400).json({
      error: "데이터가 올바르지 않습니다",
    });
    return;
  }

  con.query(sql, [res.locals.email, title, content], (err, data) => {
    if (err) {
      res.status(400).json({
        error: "알수 없는 에러",
      });
    }

    res.status(200).json({
      success: "성공적으로 포스트를 추가했습니다",
    });
  });
});

router.delete("/:id", verifyToken, (req, res, next) => {
  const sql = "DELETE FROM posts WHERE id = ?";
  const id = req.params.id;

  con.query(sql, [id], (err, data) => {
    if (err) {
      res.status(400).json({
        error: "알수 없는 에러",
      });
    }

    res.status(200).json({
      success: "성공적으로 포스트를 제거했습니다",
    });
  });
});

module.exports = router;
