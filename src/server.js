'use strict';

const express = require('express');
const cors = require('cors');
const error404 = require('./error-handlers/404');
const error500 = require('./error-handlers/500');
const authRoutes = require('./auth/routes');
const routes = require('./routes/routes');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authRoutes);
app.use('/', routes);
app.use('*', error404);
app.use(error500);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
