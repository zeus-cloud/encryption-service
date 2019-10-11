const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

var encrypt = require('./encryption');
var decrypt = require('./decryption');

const port = 8081;
const app = express();

app.use(bodyParser.json());

app.get('/enc', (req, res) => {
  encrypt({lugar: './input/', archivo: req.query.archivo}).then(
  () => res.send({procces:"done"}),
  (e) => {
    console.log("Encryption error nr: " + e);
    res.status(404).send('File not found');
  });
});

app.get('/des', (req, res) => {
  decrypt({lugar: './encrypted/', archivo: req.query.archivo}).then(
  () => res.send({procces:"done"}),
  (e) => {
    console.log("Decryption error nr: " + e);
    res.status(404).send('File not found');
  });
});

console.log(`Encryption - Decrypton service running on ${port}`);
app.listen(port);
