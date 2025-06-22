/////////////////////////////////////////////////////////
// CLASES PRINCIPALES DEL SISTEMA
/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
// Clase Cliente
/////////////////////////////////////////////////////////

class Cliente {
  static idCliente = 1;

  constructor(pNombre, pNombreUsuario, pContrasenia, pNombrePerro, pTamanioPerro) {
    this.id = Cliente.idCliente++;
    this.nombre = pNombre;
    this.nombreUsuario = pNombreUsuario.toLowerCase();
    this.contrasenia = pContrasenia;
    this.nombrePerro = pNombrePerro;
    this.tamanioPerro = pTamanioPerro; // "chico", "mediano", "grande"
  }

  mostrarInfo() {
    return `${this.nombre} (${this.nombreUsuario}) - Perro: ${this.nombrePerro} (${this.tamanioPerro})`;
  }
}

/////////////////////////////////////////////////////////
// Clase Paseador
/////////////////////////////////////////////////////////

class Paseador {
  static idPaseador = 1;

  constructor(pNombreUsuario, pContrasenia, pCupos, pTamanioPerro, pFoto, pNombreCompleto, pDescripcion, pEstrellas) {
    this.id = Paseador.idPaseador++;
    this.nombreUsuario = pNombreUsuario.toLowerCase();
    this.contrasenia = pContrasenia;
    this.cupos = pCupos; // cupos totales disponibles
    this.tamanioPerro = pTamanioPerro; // tamaño que pasea: "chico", "mediano", "grande"
    this.foto = pFoto;
    this.nombreCompleto = pNombreCompleto;
    this.descripcion = pDescripcion;
    this.estrellas = pEstrellas;
  }
}

/////////////////////////////////////////////////////////
// Clase Contratacion
/////////////////////////////////////////////////////////

class Contratacion {
  static idContratacion = 1;

  constructor(pCliente, pPaseador) {
    this.id = Contratacion.idContratacion++;
    this.cliente = pCliente;
    this.paseador = pPaseador;
    this.tamanioPerro = pCliente.tamanioPerro;
    this.estado = "Pendiente"; // Pendiente, Aprobada, Rechazada, Cancelada
  }
}