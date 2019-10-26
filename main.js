const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

var encrypt = require('./encryption');
var decrypt = require('./decryption');

const { Readable } = require('stream');

const port = 8083;
const app = express();

app.use(bodyParser.json());

console.log(process.env.PKEY || "No se encuentra .env");

app.post('/enc', (req, res) => {
  encrypt({
            lugar: bufferToStream(Buffer.from(req.body.buffer)),
            archivo: req.body.originalname,
         }).then(
  () => {
    res.send({procces:"done"});
    console.log("Archivo encriptado: " + req.body.originalname);},
  (e) => {
    console.log("Encryption error nr: " + e);
    res.status(404).send({procces: 'File not found error encryption nr: ' + e});
  });
});

app.get('/enc/**', (req, res) => {
  decrypt({archivo: req.query.archivo}).then(
  (body) => {
    console.log("Archivo desencriptado: " + body.archivo);
    res.send(body);
  },
  (e) => {
    console.log("Decryption error nr: " + e);
    res.status(404).send('Error triggered: ' + e);
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
