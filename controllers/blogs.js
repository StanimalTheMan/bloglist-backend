const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  let body = request.body;
  if (!("likes" in body)) {
    body = { ...body, likes: 0 };
  }

  if (!("title" in body && "url" in body)) {
    response.status(400).end();
    return;
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  // try { // if used, need 'next' as a paremeter
  //   const savedBlog = await blog.save();
  //   response.json(savedBlog);
  // } catch (exception) {
  //   next(exception);
  // }

  const savedBlog = await blog.save();
  response.json(savedBlog);
});

module.exports = blogsRouter;
