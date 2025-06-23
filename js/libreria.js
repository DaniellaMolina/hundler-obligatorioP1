/////////////////////////////////////////////////////////
// LIBRERÍA DE FUNCIONES UTILITARIAS
/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
// Obtener valores desde inputs
/////////////////////////////////////////////////////////

// Devuelve el valor de un campo de texto/input por su ID
function obtenerValorDeUnCampo(pIdDelCampo) {
  let elemento = document.querySelector("#" + pIdDelCampo);
  return elemento ? elemento.value : "";
}

// Devuelve el valor numérico (conversión automática) de un input
function obtenerValorDeUnCampoNumerico(pIdDelCampo) {
  let elemento = document.querySelector("#" + pIdDelCampo);
  return elemento ? Number(elemento.value) : NaN;
}

/////////////////////////////////////////////////////////
// Validaciones
/////////////////////////////////////////////////////////

// Verifica si un número es válido y positivo
function esNumeroYPositivo(pNumero) {
  return typeof pNumero === "number" && !isNaN(pNumero) && pNumero > 0;
}

// Verifica si un string contiene algún dato (no vacío)
function hayDatos(pString) {
  return typeof pString === "string" && pString.trim() !== "";
}

// Verifica si una contraseña tiene al menos 5 caracteres,
// una mayúscula, una minúscula y un número
function contraseniaValida(pContrasenia) {
  if (typeof pContrasenia !== "string" || pContrasenia.length < 5) {
    return false;
  }

  // Usamos regex para mayor precisión
  let tieneMayuscula = /[A-Z]/.test(pContrasenia);
  let tieneMinuscula = /[a-z]/.test(pContrasenia);
  let tieneNumero = /\d/.test(pContrasenia);

  return tieneMayuscula && tieneMinuscula && tieneNumero;
}

/////////////////////////////////////////////////////////
// Manipulación de elementos en pantalla
/////////////////////////////////////////////////////////

// Oculta un elemento (agrega la clase CSS "oculto")
function ocultarElemento(idElemento) {
  let elemento = document.querySelector(`#${idElemento}`);
  if (elemento) {
    elemento.classList.add("oculto");
  } else {
    console.warn(`ocultarElemento: No se encontró el elemento con id '${idElemento}'`);
  }
}

// Muestra un elemento (remueve la clase CSS "oculto")
function mostrarElemento(idElemento) {
  let elemento = document.querySelector(`#${idElemento}`);
  if (elemento) {
    elemento.classList.remove("oculto");
  } else {
    console.warn(`mostrarElemento: No se encontró el elemento con id '${idElemento}'`);
  }
}

// Limpia el contenido de un campo de texto/input
function limpiarCampo(idDelCampo) {
  let elemento = document.querySelector(`#${idDelCampo}`);
  if (elemento) {
    elemento.value = "";
  } else {
    console.warn(`limpiarCampo: No se encontró el elemento con id '${idDelCampo}'`);
  }
}

// Inserta contenido HTML en un elemento por ID
function mostrarAlgoHTML(idDelElemento, contenido) {
  let elemento = document.querySelector(`#${idDelElemento}`);
  if (elemento) {
    elemento.innerHTML = contenido;
  } else {
    console.warn(`mostrarAlgoHTML: No se encontró el elemento con id '${idDelElemento}'`);
  }
}