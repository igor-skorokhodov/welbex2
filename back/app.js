const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const router = require('./routes/index');
const NotError = require('./errors/not-found-err');
const ServerError = require('./errors/server-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const CORS_WHITELIST = [
  'http://localhost:3000',
];

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const corsOption = {
  credentials: true,
  origin: function checkCorsList(origin, callback) {
    if (CORS_WHITELIST.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const { PORT = 3001 } = process.env;

const app = express();

app.use(helmet());

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/tabledb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(limiter);

app.use(cors(corsOption));

app.use(router);

app.get('*', () => {
  throw new NotError('страница не найдена');
});

app.use(errorLogger);

app.use(errors());

app.use(ServerError);

app.listen(PORT);
