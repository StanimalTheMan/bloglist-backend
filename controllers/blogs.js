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

blogsRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id);
});

blogsRouter.update("/:id", (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog);
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
