const User = require("../model/User");

const handleLogout = async (req, res) => {
  //on client, also delete the accessToken

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // no content
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  //Is refreshToken in db?

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }
  // Delete refreshToken in db
  // const otherUsers = usersDB.users.filter(
  //   (person) => person.refreshToken !== foundUser.refreshToken
  // );
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); // secure: true - only serves on https. Ad in production
  res.sendStatus(204);
};

module.exports = { handleLogout };
