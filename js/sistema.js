// MODELO DE DATOS PRINCIPAL 
function Sistema() {
  this.clientes = [];
  this.paseadores = [];
  this.usuarioLogueado = null;

  this.cargarDatos();
}

//Guardar en localStorage
Sistema.prototype.guardarDatos = function () {
  localStorage.setItem("clientes", JSON.stringify(this.clientes));
  localStorage.setItem("paseadores", JSON.stringify(this.paseadores));
  localStorage.setItem("usuarioLogueado", JSON.stringify(this.usuarioLogueado));
};

//Cargar desde localStorage
Sistema.prototype.cargarDatos = function () {
  let clientesGuardados = localStorage.getItem("clientes");
  if (clientesGuardados) {
    this.clientes = JSON.parse(clientesGuardados);
  }

  let paseadoresGuardados = localStorage.getItem("paseadores");
  if (paseadoresGuardados) {
    this.paseadores = JSON.parse(paseadoresGuardados);
  }

  let usuarioLogueadoGuardado = localStorage.getItem("usuarioLogueado");
  if (usuarioLogueadoGuardado) {
    this.usuarioLogueado = JSON.parse(usuarioLogueadoGuardado);
  }
};

//Registro Cliente 
Sistema.prototype.registrarCliente = function (nuevoCliente) {
  if (this.clientes.some(c => c.usuario.toLowerCase() === nuevoCliente.usuario.toLowerCase())) {
    return { mensaje: "El usuario ya está registrado." };
  }
  this.clientes.push(nuevoCliente);
  this.guardarDatos();
  return { mensaje: "Cliente registrado con éxito." };
};

/* ----- Registro Paseador ----- */
Sistema.prototype.registrarPaseador = function (nuevoPaseador) {
  if (this.paseadores.some(p => p.usuario.toLowerCase() === nuevoPaseador.usuario.toLowerCase())) {
    return { mensaje: "El usuario ya está registrado." };
  }
  this.paseadores.push(nuevoPaseador);
  this.guardarDatos();
  return { mensaje: "Paseador registrado con éxito." };
};

//Login
Sistema.prototype.login = function (usuario, contrasena) {
  // Buscar cliente
  for (const cliente of this.clientes) {
    if (
      cliente.usuario.toLowerCase() === usuario.toLowerCase() &&
      cliente.contrasena === contrasena
    ) {
      this.usuarioLogueado = cliente;
      this.guardarDatos();
      return { exito: true, mensaje: "Inicio de sesión exitoso como cliente.", rol: "cliente" };
    }
  }

  // Buscar paseador
  for (const paseador of this.paseadores) {
    if (
      paseador.usuario.toLowerCase() === usuario.toLowerCase() &&
      paseador.contrasena === contrasena
    ) {
      this.usuarioLogueado = paseador;
      this.guardarDatos();
      return { exito: true, mensaje: "Inicio de sesión exitoso como paseador.", rol: "paseador" };
    }
  }

  return { exito: false, mensaje: "Usuario o contraseña incorrectos." };
};

//Logout
Sistema.prototype.logout = function () {
  this.usuarioLogueado = null;
  localStorage.removeItem("usuarioLogueado");
};

const sistema = new Sistema();