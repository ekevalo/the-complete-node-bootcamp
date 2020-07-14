const mongoose = require('mongoose');
const chalk = require('chalk');

const connected = chalk.bold.cyan;
const error = chalk.bold.red;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;

module.exports = function mongoDBConnection(dBConnection) {
  // Open a Mongoose connection at application startup
  mongoose.connect(dBConnection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  // MONGOOSE CONNECTION EVENTS
  mongoose.connection.on('connected', () => {
    console.log(
      connected`MongoDB: [{red.bold ${dBConnection}}] Connection Established Successfully`
    );
  });

  mongoose.connection.on('error', function (err) {
    console.log(error(`Database Connection Error:  ${err}`));
  });

  mongoose.connection.on('disconnected', () => {
    console.log(disconnected('Database Disconnected!'));
  });

  // CAPTURE APP TERMINATION / RESTART EVENTS
  // To be called when process is restarted or terminated

  // By catching the SIGINT handler, you are preventing the default behaviour,
  // which is to quit the process; process.exit() at the end of SIGINT handler
  // quits the process gracefully

  /**
   * Close Mongoose connection, passing through ananonymous
   * function to run when closed
   * @param msg
   * @param callback
   */

  const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
      console.log(termination`Database disconnected through {blue [${msg}]}`);
      callback();
    });
  };

  // For nodemon Restarts
  process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
      process.kill(process.pid, 'SIGUSR2');
    });
  });

  // For (node) App Termination
  process.on('SIGINT', () => {
    gracefulShutdown('App termination', () => {
      process.exit(0);
    });
  });

  // For Heroku App Termination
  process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
      process.exit(0);
    });
  });
};
