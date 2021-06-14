const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sumLikes = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.reduce(sumLikes, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
