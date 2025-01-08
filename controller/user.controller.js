const UserModel = require("../model/user.model.js");
const bcrypt = require("bcrypt");
const { signWithJwt } = require("../utils/utils.js");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!user) {
      return res.status(400).json({ message: "User not created" });
    }

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.log("error in the registerUser function", error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = signWithJwt(user);
    // console.log(token);

    res.cookie("authToken", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF
    });

    // Send response
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in loginUser function", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const logOutUser = (req, res) => {
  res.clearCookie("authToken");
  return res.status(200).json({ message: "Welcome to the blog" });
};

module.exports = {
  registerUser,
  loginUser,
  logOutUser,
};
