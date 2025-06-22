/////////////////////////////////////////////////////////
// LIBRERÍA DE FUNCIONES UTILITARIAS
/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
// Obtener valores desde inputs
/////////////////////////////////////////////////////////

// Devuelve el valor de un campo de texto/input por su ID
function obtenerValorDeUnCampo(pIdDelCampo) {
  return document.querySelector("#" + pIdDelCampo).value;
}

// Devuelve el valor numérico (conversión automática) de un input
function obtenerValorDeUnCampoNumerico(pIdDelCampo) {
  return Number(document.querySelector("#" + pIdDelCampo).value);
}

/////////////////////////////////////////////////////////
// Validaciones
/////////////////////////////////////////////////////////

// Verifica si un número es válido y positivo
function esNumeroYPositivo(pNumero) {
  return !isNaN(pNumero) && pNumero > 0;
}

// Verifica si un string contiene algún dato (no vacío)
function hayDatos(pString) {
  return pString.trim() !== "";
}

// Verifica si una contraseña tiene al menos 5 caracteres,
// una mayúscula, una minúscula y un número
function contraseniaValida(pContrasenia) {
  let tieneMayuscula = false;
  let tieneMinuscula = false;
  let tieneNumero = false;

  if (pContrasenia.length < 5) {
    return false;
  }

  for (let i = 0; i < pContrasenia.length; i++) {
    let caracter = pContrasenia[i];

    if (caracter >= "A" && caracter <= "Z") {
      tieneMayuscula = true;
    } else if (caracter >= "a" && caracter <= "z") {
      tieneMinuscula = true;
    } else if (!isNaN(caracter)) {
      tieneNumero = true;
    }
  }

  return tieneMayuscula && tieneMinuscula && tieneNumero;
}

/////////////////////////////////////////////////////////
// Manipulación de elementos en pantalla
/////////////////////////////////////////////////////////

// Oculta un elemento (agrega la clase CSS "oculto")
function ocultarElemento(idElemento) {
  document.querySelector(`#${idElemento}`).classList.add("oculto");
}

// Muestra un elemento (remueve la clase CSS "oculto")
function mostrarElemento(idElemento) {
  document.querySelector(`#${idElemento}`).classList.remove("oculto");
}

// Limpia el contenido de un campo de texto/input
function limpiarCampo(idDelCampo) {
  document.querySelector(`#${idDelCampo}`).value = "";
}

// Inserta contenido HTML en un elemento por ID
function mostrarAlgoHTML(idDelElemento, contenido) {
  document.querySelector(`#${idDelElemento}`).innerHTML = contenido;
}
