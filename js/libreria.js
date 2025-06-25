/////////////////////////////////////////////////////////
// LIBRERÍA DE FUNCIONES UTILITARIAS
/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
// Obtener valores desde inputs
/////////////////////////////////////////////////////////

function obtenerValorDeUnCampo(pIdDelCampo) {
  const elemento = document.getElementById(pIdDelCampo);
  return elemento ? elemento.value.trim() : "";
}

function obtenerValorDeUnCampoNumerico(pIdDelCampo) {
  const elemento = document.getElementById(pIdDelCampo);
  return elemento ? Number(elemento.value) : NaN;
}

/////////////////////////////////////////////////////////
// Validaciones
/////////////////////////////////////////////////////////

function esNumeroYPositivo(pNumero) {
  return typeof pNumero === "number" && !isNaN(pNumero) && pNumero > 0;
}

function hayDatos(pString) {
  return typeof pString === "string" && pString.trim().length > 0;
}

function contraseniaValida(pContrasenia) {
  return typeof pContrasenia === "string" &&
         pContrasenia.length >= 5 &&
         /[A-Z]/.test(pContrasenia) &&
         /[a-z]/.test(pContrasenia) &&
         /\d/.test(pContrasenia);
}

/////////////////////////////////////////////////////////
// Manipulación de elementos en pantalla
/////////////////////////////////////////////////////////

function ocultarElemento(idElemento) {
  const el = document.getElementById(idElemento);
  if (el) {
    el.classList.add("oculto");
  } else {
    console.warn(`ocultarElemento: No se encontró el elemento con id '${idElemento}'`);
  }
}

function mostrarElemento(idElemento) {
  const el = document.getElementById(idElemento);
  if (el) {
    el.classList.remove("oculto");
  } else {
    console.warn(`mostrarElemento: No se encontró el elemento con id '${idElemento}'`);
  }
}

function limpiarCampo(idDelCampo) {
  const el = document.getElementById(idDelCampo);
  if (el) {
    el.value = "";
  } else {
    console.warn(`limpiarCampo: No se encontró el campo con id '${idDelCampo}'`);
  }
}

function mostrarAlgoHTML(idDelElemento, contenido) {
  const el = document.getElementById(idDelElemento);
  if (el) {
    el.innerHTML = contenido;
  } else {
    console.warn(`mostrarAlgoHTML: No se encontró el elemento con id '${idDelElemento}'`);
  }
}