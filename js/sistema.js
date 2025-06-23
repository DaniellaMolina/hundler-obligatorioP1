/////////////////////////////////////////////////////////
// SISTEMA 
/////////////////////////////////////////////////////////

class Sistema {
  constructor() {
    // Listas para almacenar clientes, paseadores y contrataciones
    this.clientes        = [];
    this.paseadores      = [];
    this.contrataciones  = [];
    this.usuarioLogueado = null;  // Usuario actualmente logueado (cliente o paseador)

    this.precargaPaseadores(); // Carga inicial de paseadores predefinidos
  }

  ///////////////////////////////////////////////////////
  // CLIENTES
  ///////////////////////////////////////////////////////

  /**
   * Agrega un nuevo cliente al sistema.
   * @param {string} pNombrePerro - Nombre del perro del cliente.
   * @param {string} pNombreUsuario - Nombre de usuario (nick) del cliente.
   * @param {string} pContrasenia - Contraseña del cliente.
   * @param {string} pNombre - Nombre para mostrar del cliente (igual al usuario).
   * @param {string} pTamanioPerro - Tamaño del perro (chico, mediano, grande).
   * @returns {boolean} true si se agregó correctamente, false si hubo error o datos inválidos.
   */
  agregarCliente(pNombrePerro,
                 pNombreUsuario,
                 pContrasenia,
                 pNombre,
                 pTamanioPerro) {

    let seAgrego = false;

    // Validaciones básicas: que haya datos, contraseña válida y usuario no repetido
    if (
      hayDatos(pNombre) &&
      hayDatos(pNombreUsuario) &&
      hayDatos(pContrasenia) &&
      hayDatos(pNombrePerro) &&
      hayDatos(pTamanioPerro) &&
      contraseniaValida(pContrasenia) &&
      this.obtenerClientePorNombreUsuario(pNombreUsuario) === null
    ) {
      // Crear instancia de Cliente y agregar a la lista
      let nuevo = new Cliente(
        pNombre,
        pNombreUsuario,
        pContrasenia,
        pNombrePerro,
        pTamanioPerro
      );
      this.clientes.push(nuevo);
      seAgrego = true;
    }
    return seAgrego;
  }

  /**
   * Busca un cliente por su nombre de usuario (nick).
   * @param {string} nick - Nombre de usuario a buscar.
   * @returns {Cliente|null} El cliente encontrado o null si no existe.
   */
  obtenerClientePorNombreUsuario(nick) {
    nick = nick.toLowerCase();
    return this.clientes.find(c => c.nombreUsuario === nick) || null;
  }

  /**
   * Intenta loguear un cliente con usuario y contraseña.
   * Si es válido, setea usuarioLogueado y devuelve true.
   * @param {string} nick - Nombre de usuario.
   * @param {string} pass - Contraseña.
   * @returns {boolean} true si login exitoso, false si no.
   */
  loginCliente(nick, pass) {
    const cli = this.obtenerClientePorNombreUsuario(nick);
    if (cli && cli.contrasenia === pass) {
      this.usuarioLogueado = cli;
      return true;
    }
    return false;
  }

  ///////////////////////////////////////////////////////
  // PASEADORES
  ///////////////////////////////////////////////////////

  /**
   * Precarga algunos paseadores con datos iniciales.
   */
  precargaPaseadores() {
    this.paseadores.push(new Paseador("maria lopez",     "1234", 5, "grande"));
    this.paseadores.push(new Paseador("carlos mendez",   "1234", 8, "grande"));
    this.paseadores.push(new Paseador("lucia fernandez", "1234", 4, "mediano"));
    this.paseadores.push(new Paseador("julian perez",    "1234", 3, "chico"));
  }

  /**
   * Busca un paseador por su nombre de usuario.
   * @param {string} nick - Nombre de usuario a buscar.
   * @returns {Paseador|null} Paseador encontrado o null.
   */
  obtenerPaseadorPorNombreUsuario(nick) {
    nick = nick.toLowerCase();
    return this.paseadores.find(p => p.nombreUsuario === nick) || null;
  }

  /**
   * Intenta loguear un paseador con usuario y contraseña.
   * Si es válido, setea usuarioLogueado y devuelve true.
   * @param {string} nick - Nombre de usuario.
   * @param {string} pass - Contraseña.
   * @returns {boolean} true si login exitoso, false si no.
   */
  loginPaseador(nick, pass) {
    const pas = this.obtenerPaseadorPorNombreUsuario(nick);
    if (pas && pas.contrasenia === pass) {
      this.usuarioLogueado = pas;
      return true;
    }
    return false;
  }

  ///////////////////////////////////////////////////////
  // CONTRATACIONES
  ///////////////////////////////////////////////////////

  /**
   * Verifica si un cliente tiene alguna contratación pendiente.
   * @param {Cliente} cliente - Cliente a verificar.
   * @returns {boolean} true si tiene alguna contratación pendiente.
   */
  tieneContratacionPendienteCliente(cliente) {
    return this.contrataciones.some(
      c => c.cliente.id === cliente.id && c.estado === "Pendiente"
    );
  }

  /**
   * Obtiene todas las contrataciones de un cliente.
   * @param {Cliente} cliente - Cliente a buscar.
   * @returns {Array} Lista de contrataciones del cliente.
   */
  obtenerContratacionesCliente(cliente) {
    return this.contrataciones.filter(c => c.cliente.id === cliente.id);
  }

  /**
   * Obtiene todas las contrataciones de un paseador.
   * @param {Paseador} paseador - Paseador a buscar.
   * @returns {Array} Lista de contrataciones del paseador.
   */
  obtenerContratacionesPaseador(paseador) {
    return this.contrataciones.filter(c => c.paseador.id === paseador.id);
  }

  /**
   * Cuenta la cantidad total de cupos usados por un paseador,
   * sumando las contrataciones aprobadas según el tamaño de los perros.
   * @param {Paseador} paseador
   * @returns {number} Total de cupos usados.
   */
  contarCuposUsados(paseador) {
    let total = 0;
    for (let c of this.contrataciones) {
      if (c.paseador.id === paseador.id && c.estado === "Aprobada") {
        total += this.obtenerCuposPorTamanio(c.tamanioPerro);
      }
    }
    return total;
  }

  /**
   * Devuelve la cantidad de cupos que ocupa un perro según su tamaño.
   * @param {string} tam - Tamaño del perro (chico, mediano, grande).
   * @returns {number} Cupos ocupados.
   */
  obtenerCuposPorTamanio(tam) {
    if (tam === "grande") return 4;
    if (tam === "mediano") return 2;
    return 1;  // chico
  }

  /**
   * Verifica si un paseador tiene cupo disponible para un perro de cierto tamaño.
   * @param {Paseador} paseador
   * @param {string} tamPerro
   * @returns {boolean} true si hay cupo disponible.
   */
  tieneCupoDisponible(paseador, tamPerro) {
    if (paseador.tamanioPerro !== tamPerro) return false;
    return (
      this.contarCuposUsados(paseador) + this.obtenerCuposPorTamanio(tamPerro)
    ) <= paseador.cupos;
  }

  /**
   * Devuelve lista de paseadores que tienen cupo disponible para un perro de cierto tamaño.
   * @param {string} tamPerro
   * @returns {Array} Lista de paseadores disponibles.
   */
  obtenerPaseadoresDisponibles(tamPerro) {
    return this.paseadores.filter(p => this.tieneCupoDisponible(p, tamPerro));
  }

  /**
   * Agrega una nueva contratación entre cliente y paseador si no tiene pendiente.
   * @param {Cliente} cliente
   * @param {Paseador} paseador
   * @returns {boolean} true si se agregó con éxito.
   */
  agregarContratacion(cliente, paseador) {
    if (this.tieneContratacionPendienteCliente(cliente)) return false;
    this.contrataciones.push(new Contratacion(cliente, paseador));
    return true;
  }

  /**
   * Cancela la reserva pendiente de un cliente.
   * @param {Cliente} cliente
   * @returns {boolean} true si se canceló con éxito.
   */
  cancelarReservaPendiente(cliente) {
    let c = this.contrataciones.find(
      con => con.cliente.id === cliente.id && con.estado === "Pendiente"
    );
    if (c) {
      c.estado = "Cancelada";
      return true;
    }
    return false;
  }

  /**
   * Aprueba una contratación según su id.
   * Cambia estados a Aprobada, Rechazada si no hay cupo,
   * y aplica reglas de incompatibilidad.
   * @param {number} idContr
   * @returns {boolean} true si se aprobó con éxito.
   */
  aprobarContratacion(idContr) {
    let c = this.contrataciones.find(ct => ct.id === idContr);
    if (!c) return false;

    let p = c.paseador;
    if (!this.tieneCupoDisponible(p, c.tamanioPerro)) {
      c.estado = "Rechazada"; // sin cupo
      return false;
    }

    c.estado = "Aprobada";

    // Si se quedó sin cupo, rechaza pendientes restantes del paseador
    if (this.contarCuposUsados(p) >= p.cupos) {
      this.contrataciones.forEach(otro => {
        if (otro.paseador.id === p.id && otro.estado === "Pendiente") {
          otro.estado = "Rechazada";
        }
      });
    }

    // Regla de incompatibilidad: no mezclar perros chicos con grandes
    this.contrataciones.forEach(otro => {
      if (
        otro.paseador.id === p.id &&
        otro.estado === "Pendiente" &&
        ((c.tamanioPerro === "grande" && otro.tamanioPerro === "chico") ||
         (c.tamanioPerro === "chico"  && otro.tamanioPerro === "grande"))
      ) {
        otro.estado = "Rechazada";
      }
    });

    return true;
  }

  ///////////////////////////////////////////////////////
  // MÉTODOS AUXILIARES QUE USA LA UI
  ///////////////////////////////////////////////////////

  /**
   * Devuelve cupos disponibles para un paseador.
   * @param {Paseador} paseador
   * @returns {number} Cupos restantes disponibles.
   */
  cuposDisponiblesParaPaseador(paseador) {
    return paseador.cupos - this.contarCuposUsados(paseador);
  }

  /**
   * Obtiene contrataciones pendientes de un paseador por su nombre de usuario.
   * @param {string} nick - Nombre de usuario del paseador.
   * @returns {Array} Lista de contrataciones pendientes.
   */
  obtenerContratacionesPendientesPorPaseador(nick) {
    nick = nick.toLowerCase();
    return this.contrataciones.filter(
      c => c.paseador.nombreUsuario === nick && c.estado === "Pendiente"
    );
  }

  /**
   * Obtiene los perros asignados (clientes con contratacion aprobada) a un paseador.
   * @param {string} nick - Nombre de usuario del paseador.
   * @returns {Array} Lista de clientes/perros asignados.
   */
  obtenerPerrosAsignados(nick) {
    nick = nick.toLowerCase();
    return this.contrataciones
      .filter(
        c => c.paseador.nombreUsuario === nick && c.estado === "Aprobada"
      )
      .map(c => c.cliente);
  }

  /**
   * Resumen del cupo usado y disponible de un paseador.
   * @param {string} nick - Nombre de usuario del paseador.
   * @returns {object} { ocupados, maximo, porcentaje }
   */
  resumenCupoPaseador(nick) {
    const p = this.obtenerPaseadorPorNombreUsuario(nick);
    let ocupados = this.contarCuposUsados(p);
    return {
      ocupados,
      maximo: p.cupos,
      porcentaje: ((ocupados / p.cupos) * 100).toFixed(0)
    };
  }
}