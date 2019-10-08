/*
  Funcion de des-encriptacion:

  Prepara los datos para la desencriptacion
  Arma el stream de lectura
  Genera el cifrador con clave pincipal y toma el vector de inicio del stream leido
  Des encripta los archivos
  Arma el stream de escritura

  Pre-condicion:

  Entrda:
  {
    archivo
  }

  archivo: string de locacion del archivo (absoluta o relativa sobre la ubicacion del servicio)

  TODO:
    - Manejo de errores

*/

require('dotenv').config();       // Carga de archivo de configuracion

const crypto = require('crypto'); // Libreria de encriptacion
const fs = require('fs');         // Libreria para manejo de archivos

function decrypt({archivo}) {

  //Genera stream de lectura
  const strenVec = fs.createReadStream(archivo, { end: 15 });

  let initVect;
  //Toma el vector de inicio para la desencriptacion (los primero 16 caracteres)
  strenVec.on('data', (chunk) => {
    initVect = chunk;
  });

  strenVec.on('close', () => {
    //Genera el desencriptador
    const cipherKey = crypto.createHash('sha256').update(process.env.PKEY).digest();

    //Lee el archivo de manera asincronica
    //Apartir del caracter 16 que es despues de el vector de inicio
    const streamLec = fs.createReadStream(archivo, { start: 16 });

    //Crea el desencriptador de aes256 con la clave hash y el vector
    const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);

    //Genera el stream de escritura de manera asincronica
    const streamEsc = fs.createWriteStream(archivo.slice(0, archivo.length-5) + '.inzeus');

    //Ejecuta la secuencia asincronica
    streamLec
      .pipe(decipher)
      .pipe(streamEsc);
  });
}

module.exports = decrypt;
