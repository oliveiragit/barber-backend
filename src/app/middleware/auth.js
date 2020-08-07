const jwt = require("jsonwebtoken");
const { secret } = require("../../config/auth");
const { promisify } = require("util");

module.exports = async (req, res, next) => {
  try {
    const [, authHeader] = req.headers.authorization.split(" ");

    const decoded = await promisify(jwt.verify)(authHeader, secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "user isn't authorized" });
  }
};
