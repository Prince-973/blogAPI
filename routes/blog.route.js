const express = require("express");
const {
  getAllPosts,
  addNewPost,
  getPostById,
  updatePostById,
  deletePostById,
} = require("../controller/blog.controller.js");

const route = express.Router();

route.get("/posts", getAllPosts);
route.get("/posts/:id", getPostById);

route.post("/posts", addNewPost);

route.put("/posts/:id", updatePostById);

route.delete("/post/:id", deletePostById);

module.exports = route;
