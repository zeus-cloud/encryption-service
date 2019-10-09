var encrypt = require('./encryption');
var decrypt = require('./decryption');

encrypt({archivo: './hola.txt'}).then(
  ( ) => decrypt({archivo: './hola.txt.zeus'}).then(
    ( ) => console.log("Finish"),
    (e) => console.log(e)),
  (e) => console.log(e));
