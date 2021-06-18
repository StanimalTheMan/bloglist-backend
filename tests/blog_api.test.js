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
  },
  {
    title: "Bra Post",
    author: "Bryan",
    url: "https://www.themovieblog.com/2021/06/first-cow-2019-a-tale-of-eternal-friendship/",
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

afterAll(() => {
  mongoose.connection.close();
});
