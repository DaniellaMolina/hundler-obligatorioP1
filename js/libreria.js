/////////////////////////////////////////////////////////
// LIBRERÍA DE FUNCIONES UTILITARIAS
/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
// Obtener valores desde inputs
/////////////////////////////////////////////////////////

function obtenerValorDeUnCampo(pIdDelCampo) {
  let elemento = document.querySelector("#" + pIdDelCampo);
  return elemento ? elemento.value.trim() : "";
}

function obtenerValorDeUnCampoNumerico(pIdDelCampo) {
  let elemento = document.querySelector("#" + pIdDelCampo);
  return elemento ? Number(elemento.value) : NaN;
}

/////////////////////////////////////////////////////////
// Validaciones
/////////////////////////////////////////////////////////

function esNumeroYPositivo(pNumero) {
  return typeof pNumero === "number" && !isNaN(pNumero) && pNumero > 0;
}

function hayDatos(pString) {
  return typeof pString === "string" && pString.trim() !== "";
}

function contraseniaValida(pContrasenia) {
  if (typeof pContrasenia !== "string" || pContrasenia.length < 5) {
    return false;
  }
  return /[A-Z]/.test(pContrasenia) && /[a-z]/.test(pContrasenia) && /\d/.test(pContrasenia);
}

/////////////////////////////////////////////////////////
// Manipulación de elementos en pantalla
/////////////////////////////////////////////////////////

function ocultarElemento(idElemento) {
  let elemento = document.querySelector(`#${idElemento}`);
  if (elemento) {
    elemento.classList.add("oculto");
  } else {
    console.warn(`ocultarElemento: No se encontró el elemento con id '${idElemento}'`);
  }
}

function mostrarElemento(idElemento) {
  let elemento = document.querySelector(`#${idElemento}`);
  if (elemento) {
    elemento.classList.remove("oculto");
  } else {
    console.warn(`mostrarElemento: No se encontró el elemento con id '${idElemento}'`);
  }
}

function limpiarCampo(idDelCampo) {
  let elemento = document.querySelector(`#${idDelCampo}`);
  if (elemento) {
    elemento.value = "";
  } else {
    console.warn(`limpiarCampo: No se encontró el elemento con id '${idDelCampo}'`);
  }
}

function mostrarAlgoHTML(idDelElemento, contenido) {
  let elemento = document.querySelector(`#${idDelElemento}`);
  if (elemento) {
    elemento.innerHTML = contenido;
  } else {
    console.warn(`mostrarAlgoHTML: No se encontró el elemento con id '${idDelElemento}'`);
  }
}
