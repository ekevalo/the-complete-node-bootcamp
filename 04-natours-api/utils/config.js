/**********************************************
 * General configuration options for the server.
 ***********************************************/

const appRootPath = require('app-root-path');
const dotenv = require('dotenv');

// robust util for getting app root across all runtime environments.
const appRoot = appRootPath.toString();
dotenv.config({ path: `${appRoot}/config.env` });

const port = process.env.PORT;

const dbURIAtlas = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const dbURILocal = process.env.DATABASE_LOCAL;
const dbURI = [dbURILocal, dbURIAtlas];

module.exports = {
  host: '0.0.0.0',
  port: port,
  dbUrl: dbURI[0],
  appUrl: `http://127.0.0.1:${port}`,
  appRoot: appRoot,
};
