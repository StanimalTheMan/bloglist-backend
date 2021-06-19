const Blog = require("../models/blog");
const User = require("../models/user");

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

const nonExistingId = async () => {
  const blog = new Blog({
    title: "non-existent",
    author: "NA",
    url: "https://www.mlb.com",
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
