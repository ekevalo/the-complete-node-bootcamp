const chalk = require('chalk');
const dotenv = require('dotenv');
const app = require('./app');
const mongooseConnection = require('./utils/mongooseConnection');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down ...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: `${__dirname}/config.env` });

const dbURIAtlas = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const dbURILocal = process.env.DATABASE_LOCAL;

const port = process.env.PORT || 3000;

const dbURI = [dbURILocal, dbURIAtlas];

//***  Start Server  ***//
const server = app.listen(port, () => {
  console.log(
    chalk`{blue Server Started on Port} <{red.bold ${port}}> {blue Sucessfully!}`
  );
});

//***  Connect to Database  ***//
mongooseConnection(dbURI[0]);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down ...');
  server.close(() => {
    process.exit(1);
  });
});

//const mongoose = require('mongoose');
// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     // .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log(
//       chalk`{red <->}{blue Server Connected to} {red.bold Database} {blue Successfully!}{red <->}`
//     );
//   })
//   .catch((err) => {
//     console.log('Connection Error:', err);
//   });
