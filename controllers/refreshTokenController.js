const User = require("../model/User");
const { request } = require("express");
const jwt = require("jsonwebtoken");
// require("dotenv").config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden
  //evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.user },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "90s" } //5-10 mins in production
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
