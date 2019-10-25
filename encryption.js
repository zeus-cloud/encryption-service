/*
  Funcion de encriptacion:

  Prepara los datos para la encriptacion
  Arma el stream de lectura
  Genera el cifrador con clave pincipal y vector de inicio pseudo-aleatorio
  Une los streams de manera asincronica
  Arma el stream de escritura

  Pre-condicion:
    - Generacion de hash de clave de cifrador
    - Union de strams de vector de inicio con stream de datos de salida

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

const {Transform} = require('stream'); //Clase de transformacion de stream asincronicos
var Request = require("request");

const ext = '.zeus';

//Union de vector de inicio y stream de datos
class UnionVectorInicio extends Transform {
  //Reconstrucion del constructor
  constructor(initVect, opts) {
    super(opts);
    this.initVect = initVect;
    this.union = false;
  }

  //Transformacion de inicio de union
  _transform(chunk, cifrado, cb) {
    if (!this.union) {
      this.push(this.initVect);
      this.union = true;
    }
    this.push(chunk);
    cb();
  }
}

function encrypt({lugar, archivo}) {
  return new Promise((resolve, reject) =>{
    try {
      //Clave principal del cifrado
      //La clave la transforma en un hash de 32 de largo univoco para usar como contraseña del aes
      const ClavePrincipal = crypto.createHash('sha256').update(process.env.PKEY || '1234567890').digest();
      //Cifrado del archivo
      const cipher = crypto.createCipher('aes256', ClavePrincipal);
      //Ejecucion del pipe de encriptacion asincronico
      lugar.pipe(cipher);
      //Strem a buffer
      var bufs = [];
      cipher.on('data', function(d){ bufs.push(d); });
      cipher.on('end', function(){var buf = Buffer.concat(bufs);sendfile({originalname: archivo + ext, buffer: buf});resolve();});
    }catch(e){
      reject(e);
    }
  })
};

function sendfile(file){
  Request.post('http://'+env.process.FS_IP+':'+env.process.FS_PORT+'/file', {json: file},
    (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }
      console.log("ok");
  })
}

module.exports = encrypt;
