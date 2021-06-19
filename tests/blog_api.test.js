const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");
const User = require("../models/user");

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  //   let blogObject = new Blog(helper.initialBlogs[0]);
  //   await blogObject.save();
  //   blogObject = new Blog(helper.initialBlogs[1]);
  //   await blogObject.save();
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("when there is initially some blogs saved", () => {
  test("blog posts are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blog posts are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("unique identifier property of blog posts is named id", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
  });
});

describe("addition of a new blog", () => {
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
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");

    const contents = response.body.map((r) => r.title);

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
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
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const blogsAtEnd = await helper.blogsInDb();

    const likes = blogsAtEnd[blogsAtEnd.length - 1].likes;

    expect(likes).toBe(0);
  });

  test("if title and url properties are missing from the request data, response will have a status code of 400 Bad Request, is not added", async () => {
    const badPost = {
      author: "Eric",
      likes: 98,
    };

    await api.post("/api/blogs").send(badPost).expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);

    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("updating a blog", () => {
  test("a blog can be updated", async () => {
    const blogs = await helper.blogsInDb();
    const blogToUpdate = blogs[0];
    const blog = {
      title: "Jiggy",
      author: "Jiggy animal",
      url: "https://www.happier.com/blog/",
      likes: 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedBlogs = await helper.blogsInDb();
    const updatedBlogTitle = updatedBlogs[0].title;

    expect(updatedBlogTitle).toContain("Jiggy");
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "stanjy",
      name: "Stan Fernandez",
      password: "testpass123",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username is already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if password is shorter than 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "junebug21",
      name: "Joon",
      password: "sa",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "password must be at least 3 characters long"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  // can similarly add tests for missing username, missing password, short username for practice
});

afterAll(() => {
  mongoose.connection.close();
});
