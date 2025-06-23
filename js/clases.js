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
    this.nombreUsuario = pNombreUsuario.toLowerCase(); // case insensitive
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

  constructor(pNombreUsuario, pContrasenia, pCuposMaximos, pTamanioPerro, pFoto, pNombreCompleto, pDescripcion, pEstrellas) {
    this.id = Paseador.idPaseador++;
    this.nombreUsuario = pNombreUsuario.toLowerCase();
    this.contrasenia = pContrasenia;
    this.cuposMaximos = pCuposMaximos; // cupos totales disponibles
    this.tamanioPerro = pTamanioPerro; // tamaño que pasea: "chico", "mediano", "grande"
    this.foto = pFoto;
    this.nombreCompleto = pNombreCompleto;
    this.descripcion = pDescripcion;
    this.estrellas = pEstrellas;

    this.contratacionesAprobadas = []; // Array para guardar contrataciones aprobadas
  }

  // Método para calcular cupos ocupados según perros asignados
  get cuposOcupados() {
    let total = 0;
    for (const c of this.contratacionesAprobadas) {
      switch (c.tamanioPerro) {
        case "grande":
          total += 4;
          break;
        case "mediano":
          total += 2;
          break;
        case "chico":
          total += 1;
          break;
      }
    }
    return total;
  }

  // Cupos disponibles actualmente
  get cuposDisponibles() {
    return this.cuposMaximos - this.cuposOcupados;
  }

  // Para agregar una contratacion aprobada
  agregarContratacionAprobada(contratacion) {
    this.contratacionesAprobadas.push(contratacion);
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
    this.estado = "pendiente"; // pendiente, aprobada, rechazada, cancelada
  }

  cambiarEstado(nuevoEstado) {
    const estadosValidos = ["pendiente", "aprobada", "rechazada", "cancelada"];
    if (estadosValidos.includes(nuevoEstado.toLowerCase())) {
      this.estado = nuevoEstado.toLowerCase();
      return true;
    }
    return false;
  }
}