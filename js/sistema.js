let Sistema = function () {
  this.clientes = [];
  this.paseadores = [];
};

Sistema.prototype.registrarCliente = function (nuevoCliente) {
  for (let i = 0; i < this.clientes.length; i++) {
    if (this.clientes[i].usuario.toLowerCase() === nuevoCliente.usuario.toLowerCase()) {
      return {
        exito: false,
        mensaje: "El nombre de usuario ya está registrado.",
      };
    }
  }
  this.clientes.push(nuevoCliente);

  return {
    exito: true,
    mensaje: "Cliente registrado correctamente.",
  };
};

Sistema.prototype.registrarPaseador = function (nuevoPaseador) {
  for (let i = 0; i < this.paseadores.length; i++) {
    if (this.paseadores[i].usuario.toLowerCase() === nuevoPaseador.usuario.toLowerCase()) {
      return {
        exito: false,
        mensaje: "El nombre de usuario ya está registrado.",
      };
    }
  }
  this.paseadores.push(nuevoPaseador);

  return {
    exito: true,
    mensaje: "Paseador registrado correctamente.",
  };
};

let sistema = new Sistema(); 