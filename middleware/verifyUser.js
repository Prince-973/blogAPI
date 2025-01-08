const { verifyWithJwt } = require("../utils/utils.js");
const verifyUser = (req, res, next) => {
  try {
    // Get the token from the cookie
    const token = req.cookies?.authToken;

    // console.log(token);

    if (!token) {
      return res.redirect("/");
    }

    // Verify the token
    const decoded = verifyWithJwt(token);

    // Set the decoded data to req.user
    req.user = decoded;

    //call next
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Authentication token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { verifyUser };
