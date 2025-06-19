//VALIDACIONES SENCILLAS
function esTextoValido(texto) {
  return texto !== null && texto.trim().length > 0;
}

function esContrasenaSegura(contrasena) {
  return contrasena.length >= 6;
}