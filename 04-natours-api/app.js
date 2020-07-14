/***********************/
/**  Modules         ***/
/***********************/
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const app = express();
dotenv.config({ path: `${__dirname}/config.env` });

/***********************/
/**App Route Middlewares ***/
/***********************/
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

/**********************/
/**  Middlewares    ***/
/**********************/

/*a) Serving static files */
//app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

/*b) Set View Engine */
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/*c) Set Secure http Headers */
app.use(helmet());

/*d) Development Logging html Requests */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/*e) Rate Limit Requests from same IP */
const limiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 100,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

/*f) Body Parser, reading data from body into req.body JSON */
app.use(express.json({ limit: '10kb' }));

/*f) Cookie Parser, reading cookie from body into req.cookies */
app.use(cookieParser());

/*f) UrlEncoded Parser, reading cookie from body into req.cookies */
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/*g) Data Sanitizaton against NoSQL query injection */
app.use(mongoSanitize());

/*h) Data Sanitization against XSS*/
app.use(xss());

/*i) Prevent Parameter Polution*/
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

/*j) Test Middlewares */
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

/**********************/
/**  Routes         ***/
/**********************/

/*(a) Tours Resource Route */
app.use('/', viewRouter);

/*(a) Tours Resource Route */
app.use('/api/v1/tours', tourRouter);

/*(b) Users Resource Route */
app.use('/api/v1/users', userRouter);

/*(c) Review Resource Route */
app.use('/api/v1/reviews', reviewRouter);

/*(c) Booking Resource Route */
app.use('/api/v1/bookings', bookingRouter);

/*(c) All other Unhandled Routes */
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

/*(d) Error Handling Middleware */
app.use(globalErrorHandler);

module.exports = app;
