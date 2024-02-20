const Article = require('../models/article');

// Get saved articles
module.exports.getAllArticles = (req, res, next) => {
  const userId = req.user._id;
  Article.find({ owner: userId })
    .orFail()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next({
          statusCode: 404,
          message: 'User not found',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        next({
          statusCode: 404,
          message: 'No article found',
        });
      }
      next(err);
    });
};

// Save article
module.exports.saveArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.status(201).send(article))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next({
          statusCode: 400,
          message: 'User validation failed',
        });
      }
      next(err);
    });
};

// Delete save article
module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const userId = req.user._id;
  Article.deleteOne({ _id: articleId, owner: userId })
    .orFail()
    .then((result) => {
      if (result) {
        res.status(200).send({
          message: 'Successfully deleted',
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'DocumentNotFoundError') {
        next({
          statusCode: 404,
          message: 'Article Not Found',
        });
      }
      next({
        statusCode: 500,
      });
    });
};
