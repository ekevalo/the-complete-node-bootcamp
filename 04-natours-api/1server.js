const express = require('express');
const properties = require('./utils/1properties');

const db = require('./utils/1database');

const app = express();

// call the database connectivity function
db();

app.listen(properties.PORT, (req, res) => {
  console.log(`Server is running on ${properties.PORT} port.`);
});
