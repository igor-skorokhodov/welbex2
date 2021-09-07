const Table = require('../models/table');

const ReqError = require('../errors/req-error');
const NotFoundError = require('../errors/not-found-err');

function getElements(req, res, next) {
  return Table.find({})
    .then((elements) => res.status(200).send(elements))
    .catch(next);
}

function createElement(req, res, next) {
  return Table.create({ ...req.body })
    .then((element) => {
      res.status(200).send(element);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqError('ошибка валидации'));
      } else {
        next(err);
      }
    });
}

function deleteElement(req, res, next) {
  const id = req.params.elementId;

  return Table.findById(id)
    .orFail(new NotFoundError('Запись не найдена'))
    .then((element) => {
        return Table.findByIdAndRemove(element.id)
          .orFail(new ReqError('Запись не найдена'))
          .then((data) => {
            res.status(200).send({ data });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new ReqError('Запись не найдена'));
            } else {
              next(err);
            }
          });
      })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ReqError('Запись не найдена'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getElements,
  createElement,
  deleteElement,
};
