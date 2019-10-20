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
*/

require('dotenv').config();       // Carga de archivo de configuracion

const fs = require('fs');         // Libreria para manejo de archivos
const { Readable } = require('stream');

const crypto = require('crypto'); // Libreria de encriptacion
const {Transform} = require('stream'); //Clase de transformacion de stream asincronicos
var Request = require("request-promise-native");

function decrypt({archivo}) {
  return new Promise((resolve, reject) =>{
    try {
      ask4file(archivo).then((a) => {

        var archivo = JSON.parse(a);
        //Genera stream de lectura
        const file = bufferToStream(Buffer.from(archivo.buffer));
        //Preparar la clave primaria
        const cipherKey = crypto.createHash('sha256').update(process.env.PKEY || '1234567890').digest();
        //Crea el desencriptador de aes256 con la clave hash y el vector
        const decipher = crypto.createDecipher('aes256', cipherKey);
        //Ejecuta la secuencia asincronica
        file.pipe(decipher);
        //Stream a buffer
        var bufs = [];
        decipher.on('data', function(d){ bufs.push(d); });
        decipher.on('end', function(){var buf = Buffer.concat(bufs);resolve({archivo: archivo.archivo, buffer: buf});});
      });
    } catch (e) {
      reject({tiago:"Nos re vimo"});
    }
  })
}

async function ask4file(file){
  return await Request.get('http://localhost:8082/get/?archivo='+file,
    (error, res, body) => {
      if (error) {
        console.error(error);
      }
      return res.body
    })
}

function bufferToStream(binary) {
  const readableInstanceStream = new Readable({
    read() {
      this.push(binary);
      this.push(null);
    }
  });
  return readableInstanceStream;
}

module.exports = decrypt;
