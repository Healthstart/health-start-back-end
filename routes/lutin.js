const express = require("express");
const router = express.Router();
const con = require("../db/mysql");
const verifyToken = require("./middlewares/authorization");

router.get("/alluser", (req, res) => {
  const sql =
    "SELECT lutin_id, lutin_name, lutin_index, view_count, email FROM lutins";
  con.query(sql, [], (err, data) => {
    res.status(200).json({
      success: "모든 루틴을 불러옵니다",
      data,
    });
  });
});

router.get("/alluser/order", (req, res) => {
  const sql =
    "SELECT lutin_id, lutin_name, lutin_index, view_count, email FROM lutins ORDER BY view_count DESC";
  con.query(sql, [], (err, data) => {
    res.status(200).json({
      success: "모든 루틴을 불러옵니다",
      data,
    });
  });
});

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

router.get("/info/:id", (req, res) => {
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

router.get("/favorite", verifyToken, (req, res, next) => {
  const sql =
    "SELECT fav_lutins.lutin_id, lutin_name, lutin_index, view_count FROM fav_lutins LEFT JOIN lutins ON fav_lutins.lutin_id = lutins.lutin_id WHERE favoriter=?";
  con.query(sql, [res.locals.email], (err, data) => {
    if (err) {
      res.status(400).json({
        error: "불러오지 못했습니다",
      });
      return;
    }

    res.status(200).json({
      success: "성공적으로 즐겨찾기 루틴을 불러왔습니다",
      data,
    });
  });
});

router.post("/favorite/:id", verifyToken, (req, res, next) => {
  const checkSQL =
    "SELECT lutin_id FROM fav_lutins WHERE favoriter = ? AND lutin_id = ?";
  const sql = "INSERT INTO fav_lutins VALUES(?, ?)";
  const email = res.locals.email;
  const id = req.params.id;

  con.query(checkSQL, [email, id], (err, data) => {
    if (err) {
      res.status(400).json({
        error: "알수 없는 에러가 발생했습니다",
      });
      return;
    }

    if (data.length > 0) {
      res.status(400).json({
        error: "이미 즐겨찾기가 되어있습니다",
      });
      return;
    }

    con.query(sql, [res.locals.email, req.params.id], (err, data) => {
      if (err) {
        res.status(400).json({
          error: "존재하지 않는 데이터 혹은 알 수 없는 에러가 발생했습니다",
        });
        return;
      }

      res.status(200).json({
        success: "즐겨찾기 성공",
      });
    });
  });
});

router.delete("/favorite/:id", verifyToken, (req, res, next) => {
  const sql = "DELETE FROM fav_lutins WHERE favoriter = ? AND lutin_id = ?";
  con.query(sql, [res.locals.email, req.params.id], (err, data) => {
    if (err) {
      res.status(400).json({
        error: "존재하지 않거나 즐겨찾기가 되어 있지 않습니다",
      });
      return;
    }

    res.status(200).json({
      success: "즐겨찾기가 해제되었습니다",
    });
  });
});

module.exports = router;
