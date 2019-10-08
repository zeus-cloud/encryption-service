var encrypt = require('./encryption');
var decrypt = require('./decryption');

encrypt({archivo: './hola.txt'});
setTimeout((() => decrypt({archivo: './hola.txt.zeus'})) , 2000);
