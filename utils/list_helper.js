const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sumLikes = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.reduce(sumLikes, 0);
};

const mostLikes = (blogs) => {
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

module.exports = {
  dummy,
  totalLikes,
  mostLikes,
};
