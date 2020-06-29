import {Obfuscator} from "./Obfuscator";

process.on('exit',(code) => {
    let message = "";
    switch (code) {
        case 0:
            message = "Se han procesado todos los archivos.";
            break;
        case 1:
            message = "Error: No se ha podido encontrar la ruta especificada.";
            break;
        case 2:
            message = "Error: Parametros incorrectos.";
            break;
    }
    return console.log(message);
});

if(process.argv.length < 3) process.exit(2);

const dir = process.argv.length < 4 ? process.argv[2] : process.argv[3];
const minFiles = process.argv.length < 4 ? false : process.argv[2] === "-f";

new Obfuscator(dir, minFiles);