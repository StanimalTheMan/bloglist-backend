const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  let body = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  if (!("likes" in body)) {
    body = { ...body, likes: 0 };
  }

  if (!("title" in body && "url" in body)) {
    response.status(400).end();
    return;
  }

  // const user = await User.findById(decodedToken.id);
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  // try { // if used, need 'next' as a paremeter
  //   const savedBlog = await blog.save();
  //   response.json(savedBlog);
  // } catch (exception) {
  //   next(exception);
  // }

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const blog = await Blog.findById(request.params.id);
  // const user = await User.findById(decodedToken.id);
  const user = request.user;

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  }

  return response
    .status(401)
    .json({ error: "Wrong user trying to delete blog post" });
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  // Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  //   .then((updatedBlog) => {
  //     response.json(updatedBlog);
  //   })
  //   .catch((error) => next(error));
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
