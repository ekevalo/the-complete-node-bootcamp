const mongoose = require('mongoose');
const dotenv = require('dotenv');

//require chalk module to give colors to console text
const chalk = require('chalk');

// Define a database connection string
dotenv.config({ path: `${__dirname}/../config.env` });

const dbURL = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const dbURLtest = process.env.DATABASE_LOCAL_TEST;

const connected = chalk.bold.cyan;
const error = chalk.bold.red;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;

//export this function and imported by server.js
// module.exports = function () {
//   mongoose.connect(dbURL);

// };

/*================================================================*/
const { connection } = mongoose;
connection.on(
  //     'open', () => {
  //   console.log('connected.');}
  'connected',
  () => {
    console.log(connected(`Database is Connected!`));
  }
);
connection.on(
  //     'error', (err) => {
  //   console.log(`Error: connection failed! ${err}`);}
  'error',
  (err) => {
    console.log(error(`Error Connecting to Database: ${err}`));
  }
);
connection.on(
  //     'disconnected', (err) => {
  //   console.log(`Error: disconnected! ${err}`);
  // }
  'disconnected',
  () => {
    console.log(disconnected('Database is Disconnected'));
  }
);

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log(
      termination('Database is Disconnected due to Application Termination')
    );
    process.exit(0);
  });
});

mongoose
  .connect(dbURLtest, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 1000,
  })
  .catch((err) => {
    console.log(`Error catch: ${err}`);
  });
