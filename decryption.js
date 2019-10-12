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

const ext = '.zeus';
const output = './output/';

function decrypt({lugar, archivo}) {
  return new Promise((resolve, reject) =>{
    try {
      //Genera stream de lectura
      const strenVec = fs.createReadStream(lugar + archivo + ext, { end: 15 });

      strenVec.on('error', () => reject(1));

      let initVect;
      //Toma el vector de inicio para la desencriptacion (los primero 16 caracteres)
      strenVec.on('data', (chunk) => {
        initVect = chunk;
      });

      strenVec.on('close', () => {
        //Genera el desencriptador
        const cipherKey = crypto.createHash('sha256').update(process.env.PKEY || '1234567890').digest();

        //Lee el archivo de manera asincronica
        //Apartir del caracter 16 que es despues de el vector de inicio
        const streamLec = fs.createReadStream(lugar + archivo + ext, { start: 16 });

        //Crea el desencriptador de aes256 con la clave hash y el vector
        const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);

        decipher.on('error', () => reject(4));

        //Genera el stream de escritura de manera asincronica
        const streamEsc = fs.createWriteStream(output + archivo);

        //Ejecuta la secuencia asincronica
        streamLec.on('error', () => {cleanupenc(output + archivo); reject(1)})
          .pipe(decipher)
          .on('error', () => {cleanupenc(output + archivo); reject(2)})
          .pipe(streamEsc)
          .on('error', () => {cleanupenc(output + archivo); reject(3)});

        streamLec.on('close', () =>{
          cleanupenc(lugar + archivo + ext);
          resolve();
        });
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  })
}

function cleanupenc(path){
  try {
    fs.unlinkSync(path);
  } catch(err) {
    console.error(err);
  }
}

module.exports = decrypt;
