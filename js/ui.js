window.addEventListener("load", inicio);

function inicio() {
  // Obtener parámetro rol de la URL para mostrar formulario correspondiente
  let params = new URLSearchParams(window.location.search);
  let rol = params.get("rol");

  let clienteFormSection = document.getElementById("formCliente");
  let paseadorFormSection = document.getElementById("formPaseador");

  if (rol === "cliente") {
    clienteFormSection.style.display = "block";
    paseadorFormSection.style.display = "none";

    document.querySelector("#formRegistro").addEventListener("submit", registroClienteUI);
  } else if (rol === "paseador") {
    paseadorFormSection.style.display = "block";
    clienteFormSection.style.display = "none";

    document.querySelector("#formRegistroPaseador").addEventListener("submit", registroPaseadorUI);
  } else {
    clienteFormSection.style.display = "none";
    paseadorFormSection.style.display = "none";
  }
}

let sistema = new Sistema();

function registroClienteUI(event) {
  event.preventDefault();

  let usuario = document.querySelector("#usuario").value.trim();
  let contrasena = document.querySelector("#contrasena").value.trim();
  let nombrePerro = document.querySelector("#nombrePerro").value.trim();
  let tamano = document.querySelector("#tamano").value;

  let mensaje = "";

  if (!esTextoValido(usuario) || !esTextoValido(nombrePerro) || !esTextoValido(tamano)) {
    mensaje = "Por favor completá todos los campos.";
  } else if (!esContrasenaSegura(contrasena)) {
    mensaje = "La contraseña debe tener al menos 6 caracteres.";
  } else {
    let nuevoCliente = new Cliente(usuario, contrasena, nombrePerro, tamano);
    let resultado = sistema.registrarCliente(nuevoCliente);

    mensaje = resultado.mensaje;
  }

  document.querySelector("#mensajeRegistro").innerText = mensaje;
}

function registroPaseadorUI(event) {
  event.preventDefault();

  let usuario = document.querySelector("#usuarioPaseador").value.trim();
  let contrasena = document.querySelector("#contrasenaPaseador").value.trim();
  let zona = document.querySelector("#zona").value.trim();
  let experiencia = document.querySelector("#experiencia").value.trim();

  let mensaje = "";

  if (!esTextoValido(usuario) || !esTextoValido(zona) || experiencia === "") {
    mensaje = "Por favor completá todos los campos.";
  } else if (!esContrasenaSegura(contrasena)) {
    mensaje = "La contraseña debe tener al menos 6 caracteres.";
  } else {
    let nuevoPaseador = new Paseador(usuario, contrasena, zona, experiencia);
    let resultado = sistema.registrarPaseador(nuevoPaseador);

    mensaje = resultado.mensaje;
  }

  document.querySelector("#mensajeRegistroPaseador").innerText = mensaje;
}