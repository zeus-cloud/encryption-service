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

function encrypt({archivo}) {
  return new Promise((resolve, reject) =>{
    try {
      //Vector inicio aleatorio
      //La mitad de longitud de la contraseña del algoritmo
      //Para no repetir la salida si se genera un archivo de igual condicion con la misma contraseña
      const initVect = crypto.randomBytes(16);

      //Clave principal del cifrado
      //La clave la transforma en un hash de 32 de largo univoco para usar como contraseña del aes
      const ClavePrincipal = crypto.createHash('sha256').update(process.env.PKEY).digest();

      //Lectura del archivo asincronica
      const streamLec = fs.createReadStream(archivo);

      //Cifrado del archivo
      const cipher = crypto.createCipheriv('aes256', ClavePrincipal, initVect);

      //Union con vector de inicio
      const unionVec = new UnionVectorInicio(initVect);

      //Escritura del archivo asincronica a memoria
      const streamEsc = fs.createWriteStream(archivo + ".zeus");

      //Ejecucion del pipe de encriptacion asincronico
      streamLec
        .pipe(cipher)
        .pipe(unionVec)
        .pipe(streamEsc);

      streamLec.on('close', () => resolve());
    }catch(e){
      console.log(e);
      reject(e);
    }
  })
};

module.exports = encrypt;
