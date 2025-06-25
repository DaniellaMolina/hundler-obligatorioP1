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
    this.nombreUsuario = pNombreUsuario.toLowerCase(); // case insensitive
    this.contrasenia = pContrasenia;
    this.cuposMaximos = pCuposMaximos;
    this.tamanioPerro = pTamanioPerro; // "chico", "mediano", "grande"
    this.foto = pFoto;
    this.nombreCompleto = pNombreCompleto;
    this.descripcion = pDescripcion;
    this.estrellas = pEstrellas;

    this.contratacionesAprobadas = [];
  }

  // Cupos ocupados en función del tamaño del perro
  get cuposOcupados() {
    return this.contratacionesAprobadas.reduce((total, c) => {
      switch (c.tamanioPerro) {
        case "grande": return total + 4;
        case "mediano": return total + 2;
        case "chico": return total + 1;
        default: return total;
      }
    }, 0);
  }

  // Cupos disponibles
  get cuposDisponibles() {
    return this.cuposMaximos - this.cuposOcupados;
  }

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
    this.estado = "Pendiente"; // Estado inicial
  }

  cambiarEstado(nuevoEstado) {
    const estadosValidos = ["Pendiente", "Aprobada", "Rechazada", "Cancelada"];
    if (estadosValidos.includes(nuevoEstado)) {
      this.estado = nuevoEstado;
      return true;
    }
    return false;
  }
}