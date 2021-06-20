const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sumLikes = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.reduce(sumLikes, 0);
};

const favoriteBlog = (blogs) => {
  // assumes blogs has at least one blog?
  const mostLikesReducer = (answer, item) => {
    return item.likes > answer.likes
      ? { title: item.title, author: item.author, likes: item.likes }
      : answer;
  };

  return blogs.reduce(mostLikesReducer, {
    title: blogs[0].title,
    author: blogs[0].author,
    likes: blogs[0].likes,
  });
};

const mostBlogs = (blogs) => {
  const authorsBlogCount = _.groupBy(blogs, (blog) => {
    return blog.author;
  });
  const authorWithMostBlogs = _.reduce(
    authorsBlogCount,
    (result, value, key) => {
      if (!result["author"]) {
        result["author"] = key;
        result["blogs"] = value.length;
      } else {
        if (result["blogs"] < value.length) {
          result["author"] = key;
          result["blogs"] = value.length;
        }
      }
      return result;
    },
    {}
  );

  return authorWithMostBlogs;
};

const mostLikes = (blogs) => {
  const authorsLikeCount = _.groupBy(blogs, (blog) => {
    return blog.author;
  });
  const authorWithMostLikes = _.reduce(
    authorsLikeCount,
    (result, value, key) => {
      curItemLikes = value.reduce((sum, item) => {
        return sum + item.likes;
      }, 0);
      if (!result["author"]) {
        result["author"] = key;
        result["likes"] = curItemLikes;
      } else {
        if (result["likes"] < curItemLikes) {
          result["author"] = key;
          result["likes"] = curItemLikes;
        }
      }
      return result;
    },
    {}
  );
  return authorWithMostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
