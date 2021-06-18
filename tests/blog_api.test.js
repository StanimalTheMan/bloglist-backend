const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const initialBlogs = [
  {
    title: "Stanjy Post",
    author: "Stanimal",
    url: "https://www.amazinavenue.com/2021/6/14/22532886/mets-jacob-degrom-2021-stats-10-starts-history-seaver-gooden-pedro",
    likes: 3,
  },
  {
    title: "Bra Post",
    author: "Bryan",
    url: "https://www.themovieblog.com/2021/06/first-cow-2019-a-tale-of-eternal-friendship/",
    likes: 5,
  },
];
beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test("blog posts are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blog posts are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("unique identifier property of blog posts is named id", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].id).toBeDefined();
});

test("a valid blog post can be added", async () => {
  const newBlogPost = {
    title: "Yanks post",
    author: "Drew",
    url: "https://www.pinstripealley.com/2021/6/17/22539534/yankees-news-injuries-gleyber-torres-blue-jays-back-odor-boone",
    likes: 0,
  };

  await api
    .post("/api/blogs")
    .send(newBlogPost)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const response = await api.get("/api/blogs");

  const contents = response.body.map((r) => r.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(contents).toContain("Yanks post");
});

test("if likes property is missing from request, it will default to the value 0", async () => {
  const minimalBlogPost = {
    title: "nashabaynyah",
    author: "Jiggy",
    url: "https://techcrunch.com/",
  };

  await api
    .post("/api/blogs")
    .send(minimalBlogPost)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const response = await api.get("/api/blogs");

  const likes = response.body[response.body.length - 1].likes;

  expect(likes).toBe(0);
});

test("if title and url properties are missing from the request data, response will have a status code of 400 Bad Request", async () => {
  const badPost = {
    author: "Eric",
    likes: 98,
  };

  await api.post("/api/blogs").send(badPost).expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});
