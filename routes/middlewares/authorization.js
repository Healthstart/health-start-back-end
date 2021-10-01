const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    console.log(token);
    const decode = jwt.verify(token, process.env.JWT_KEY);

    if (decode) {
      res.locals.email = decode.email;
      next();
    } else {
      res.status(401).json({ error: "유호하지 않습니다!" });
    }
  } catch (err) {
    res.status(401).json({ error: "토큰 만료" });
  }
};

module.exports = verifyToken;
