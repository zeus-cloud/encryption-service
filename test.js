/*
  encrypt({archivo: './hola.txt'}).then(
  ( ) => decrypt({archivo: './hola.txt.zeus'}).then(
    ( ) => console.log("Finish"),
    (e) => console.log(e)),
  (e) => console.log(e));
*/
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

var encrypt = require('./encryption');
var decrypt = require('./decryption');

const port = 8081;
const app = express();

app.use(bodyParser.json());

app.get('/heroes', (req, res) => {
  console.log('Returning heroes list');
  res.send({heroes:"A"});
});

app.get('/powers', (req, res) => {
  console.log('Returning powers list');
  res.send({power:"B"});
});

app.post('/hero/**', (req, res) => {
  const heroId = parseInt(req.params[0]);
  console.log(req.params);
  console.log(req.body);

  res.status(202).header({Location: "A"}).send({Atr:"B"});
});

app.use('/img', express.static(path.join(__dirname,'img')));

console.log(`Heroes service listening on port ${port}`);
app.listen(port);
