/////////////////////////////////////////////////////////
// SISTEMA - LÓGICA DE NEGOCIO
/////////////////////////////////////////////////////////

class Sistema {
  constructor() {
    this.clientes        = [];
    this.paseadores      = [];
    this.contrataciones  = [];
    this.usuarioLogueado = null;

    this.precargaPaseadores();
  }

  ///////////////////////////////////////////////////////
  // CLIENTES
  ///////////////////////////////////////////////////////
  /*  Orden de parámetros que usa la UI:
      (nombrePerro, nombreUsuario, contrasenia, nombreParaMostrar, tamanioPerro)
      – En este proyecto “nombreParaMostrar” == nombreUsuario  */
  agregarCliente(pNombrePerro,
                 pNombreUsuario,
                 pContrasenia,
                 pNombre,
                 pTamanioPerro) {

    let seAgrego = false;

    if (
      hayDatos(pNombre) &&
      hayDatos(pNombreUsuario) &&
      hayDatos(pContrasenia) &&
      hayDatos(pNombrePerro) &&
      hayDatos(pTamanioPerro) &&
      contraseniaValida(pContrasenia) &&
      this.obtenerClientePorNombreUsuario(pNombreUsuario) === null
    ) {
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

  obtenerClientePorNombreUsuario(nick) {
    nick = nick.toLowerCase();
    return this.clientes.find(c => c.nombreUsuario === nick) || null;
  }

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
  precargaPaseadores() {
    this.paseadores.push(new Paseador("maria lopez",     "1234", 5, "grande"));
    this.paseadores.push(new Paseador("carlos mendez",   "1234", 8, "grande"));
    this.paseadores.push(new Paseador("lucia fernandez", "1234", 4, "mediano"));
    this.paseadores.push(new Paseador("julian perez",    "1234", 3, "chico"));
  }

  obtenerPaseadorPorNombreUsuario(nick) {
    nick = nick.toLowerCase();
    return this.paseadores.find(p => p.nombreUsuario === nick) || null;
  }

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
  tieneContratacionPendienteCliente(cliente) {
    return this.contrataciones.some(
      c => c.cliente.id === cliente.id && c.estado === "Pendiente"
    );
  }

  obtenerContratacionesCliente(cliente) {
    return this.contrataciones.filter(c => c.cliente.id === cliente.id);
  }

  obtenerContratacionesPaseador(paseador) {
    return this.contrataciones.filter(c => c.paseador.id === paseador.id);
  }

  contarCuposUsados(paseador) {
    /* suma de cupos de contrataciones Aprobadas */
    let total = 0;
    for (let c of this.contrataciones) {
      if (c.paseador.id === paseador.id && c.estado === "Aprobada") {
        total += this.obtenerCuposPorTamanio(c.tamanioPerro);
      }
    }
    return total;
  }

  obtenerCuposPorTamanio(tam) {
    if (tam === "grande") return 4;
    if (tam === "mediano") return 2;
    return 1;               // chico
  }

  tieneCupoDisponible(paseador, tamPerro) {
    if (paseador.tamanioPerro !== tamPerro) return false;
    return (
      this.contarCuposUsados(paseador) + this.obtenerCuposPorTamanio(tamPerro)
    ) <= paseador.cupos;
  }

  obtenerPaseadoresDisponibles(tamPerro) {
    return this.paseadores.filter(p => this.tieneCupoDisponible(p, tamPerro));
  }

  agregarContratacion(cliente, paseador) {
    if (this.tieneContratacionPendienteCliente(cliente)) return false;
    this.contrataciones.push(new Contratacion(cliente, paseador));
    return true;
  }

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

  aprobarContratacion(idContr) {
    let c = this.contrataciones.find(ct => ct.id === idContr);
    if (!c) return false;

    let p = c.paseador;
    if (!this.tieneCupoDisponible(p, c.tamanioPerro)) {
      c.estado = "Rechazada";               // sin cupo
      return false;
    }

    c.estado = "Aprobada";

    /* Actualizar resto si se queda sin cupo */
    if (this.contarCuposUsados(p) >= p.cupos) {
      this.contrataciones.forEach(otro => {
        if (otro.paseador.id === p.id && otro.estado === "Pendiente") {
          otro.estado = "Rechazada";
        }
      });
    }

    /* Reglas de incompatibilidad chico-grande */
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
  cuposDisponiblesParaPaseador(paseador) {
    return paseador.cupos - this.contarCuposUsados(paseador);
  }

  obtenerContratacionesPendientesPorPaseador(nick) {
    nick = nick.toLowerCase();
    return this.contrataciones.filter(
      c => c.paseador.nombreUsuario === nick && c.estado === "Pendiente"
    );
  }

  obtenerPerrosAsignados(nick) {
    nick = nick.toLowerCase();
    return this.contrataciones
      .filter(
        c => c.paseador.nombreUsuario === nick && c.estado === "Aprobada"
      )
      .map(c => c.cliente); // devuelve los clientes (perros)
  }

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