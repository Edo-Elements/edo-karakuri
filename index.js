'use strict';

const express = require('express');
const bearerToken = require('express-bearer-token');
const karakuri = require('./karakuri');
const apikey = require('./apikey');

const app = express();
app.use(bearerToken());

app.options('*', function (req, res) {
  cors(req, res);
  res.sendStatus(200);
});

app.get('/', async (req, res) => {
  if (!req.headers.origin || (req.token != apikey(req.headers.origin))) {
    return res.status(401).send();
  }
  const response = await karakuri(req.query.url);
  cors(req, res);
  res.json(response);
});

app.get('/gen-api-key', (req, res) => {
  if (!req.headers.origin) {
    return res.status(401).send();
  }
  const key = apikey(req.headers.origin);
  cors(req, res);
  res.json({apikey: key});
});

const cors = (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers', 'Authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Max-Age', '86400');
};

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
