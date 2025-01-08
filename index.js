const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const BlogRouter = require("./routes/blog.route.js");
const UserRouter = require("./routes/user.route.js");
const { verifyUser } = require("./middleware/verifyUser.js");
const app = express();
const PORT = process.env.PORT || 8000;

//middleware
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("error connecting MongoDB", err);
  });

//routes
app.use("/user", UserRouter);
app.use("/blog", verifyUser, BlogRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the blog app",
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
