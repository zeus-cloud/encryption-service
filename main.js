const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

var encrypt = require('./encryption');
var decrypt = require('./decryption');

const { Readable } = require('stream');

const port = 8083;
const app = express();

app.use(bodyParser.json());

app.post('/enc', (req, res) => {
  encrypt({
            lugar: bufferToStream(Buffer.from(req.body.buffer)),
            archivo: req.body.originalname,
         }).then(
  () => res.send({procces:"done"}),
  (e) => {
    console.log("Encryption error nr: " + e);
    res.status(404).send('File not found error encryption nr: ' + e);
  });
});

app.post('/des', (req, res) => {
  decrypt({
            lugar: './encrypted/',
            archivo: req.query.archivo,
            user: req.query.user,
            time: req.query.time
          }).then(
  () => res.send({procces:"done"}),
  (e) => {
    console.log("Decryption error nr: " + e);
    res.status(404).send('File not found error decryption nr: ' + e);
  });
});

console.log(`Encryption - Decrypton service running on ${port}`);
app.listen(port);

function bufferToStream(binary) {
  const readableInstanceStream = new Readable({
    read() {
      this.push(binary);
      this.push(null);
    }
  });
  return readableInstanceStream;
}