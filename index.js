const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { engine } = require("express-handlebars");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const BlogRouter = require("./routes/blog.route.js");
const UserRouter = require("./routes/user.route.js");
const { verifyUser } = require("./middleware/verifyUser.js");
const app = express();
const PORT = process.env.PORT || 8000;

//middleware
app.engine("hbs", engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
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
  res.render("index");
});

cloudinary.config({
  cloud_name: "dcps71fqy",
  api_key: "293986721277768",
  api_secret: "D48hWXPlnaPlIPscAAvn0T9BGiE",
});

// Set up Multer storage engine for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif"], // File formats allowed
  },
});

// Create Multer instance with Cloudinary storage
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    // This is where you get the URL of the uploaded image
    // console.log(req.file);

    const imageUrl = req.file.path;

    // Send the URL back in the response
    res.send(`Image uploaded successfully! Image URL: ${imageUrl}`);
  } else {
    res.status(400).send("No image uploaded");
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
