'use strict';

const images = require('./services/images');
const audio = require('./services/speech.js')
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// for use with heroku
const port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json({limit: '5mb'}));
app.use(express.static(path.join(__dirname, '/..', 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/..', 'client/index.html'));
});

app.post('/upload', async (req, res) => {
  var results = await images.getImageEmotions(req.body.image);

  return res.send(results);
});

app.post('/receive', async (req, res) => {
  var results = await audio.getSpeechText(req);

  return res.send(results);
})

app.listen(port);