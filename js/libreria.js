// Validaciones
let esTextoValido = function (texto) {
  return texto !== null && texto.trim().length > 0;
};

let esContrasenaSegura = function (contrasena) {
  return contrasena.length >= 6;
};