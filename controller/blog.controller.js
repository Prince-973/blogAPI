const BlogModel = require("../model/blog.model.js");
const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const skip = (page - 1) * limit;
    const blogs = await BlogModel.find({}).skip(skip).limit(Number(limit));

    const totalPosts = await BlogModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        message: "No posts found",
      });
    }

    return res.status(200).json({
      totalPosts,
      totalPages,
      currentPage: Number(page),
      postsPerPage: Number(limit),
      blogs,
    });
  } catch (error) {
    console.error("Error in blog controller getAllPosts function", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const id = req.params.id;

    const blog = await BlogModel.findById(id);
    if (!blog) {
      return res.status(404).json({
        message: "Blog does not exist",
      });
    }
    return res.status(200).json(blog);
  } catch (error) {
    console.log("error in blog controller getPostById function", error);
  }
};

const addNewPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    const Post = await BlogModel.create({
      title,
      content,
      author,
    });

    if (!Post) {
      throw Error("Error creating post");
    }

    return res.status(201).json(Post);
  } catch (error) {
    console.log("error in blog controller addNewPost function", error);
  }
};

const updatePostById = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, author } = req.body;
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      {
        title,
        content,
        author,
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deletePostById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBlog = await BlogModel.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getAllPosts,
  addNewPost,
  getPostById,
  updatePostById,
  deletePostById,
};
