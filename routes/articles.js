const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const {
  getAllArticles,
  saveArticle,
  deleteArticle,
} = require('../controllers/articles');

function validateURL(value, helpers) {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}

router.get('/', getAllArticles);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().custom(validateURL),
      image: Joi.string().required().custom(validateURL),
    }),
  }),
  saveArticle,
);
router.delete(
  '/:articleId',
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.objectId(),
    }),
  }),
  deleteArticle,
);

module.exports = router;
