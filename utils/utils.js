const jwt = require("jsonwebtoken");

const signWithJwt = (user) => {
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  return token;
};

const verifyWithJwt = (token) => {
  const data = jwt.verify(token, process.env.JWT_SECRET);
  return data;
};

module.exports = {
  signWithJwt,
  verifyWithJwt,
};
