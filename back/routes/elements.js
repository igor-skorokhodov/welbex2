const tableRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getElements,
  createElement,
  deleteElement,
} = require('../controllers/elements');

tableRoutes.get('/', getElements);

tableRoutes.post(
  '/',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2),
        date: Joi.date().required(),
        quantity: Joi.number().required(),
        distance: Joi.number().required(),
      })
      .unknown(true),
  }),
  createElement,
);

tableRoutes.delete('/:elementId',
  celebrate({
    params: Joi.object()
      .keys({
        elementId: Joi.string().hex().length(24),
      })
      .unknown(true),
  }), deleteElement);

module.exports = tableRoutes;
