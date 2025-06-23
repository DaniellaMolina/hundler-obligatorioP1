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

  agregarCliente(pNombrePerro, pNombreUsuario, pContrasenia, pNombre, pTamanioPerro) {
    let seAgrego = false;

    // Validaciones básicas: que haya datos, contraseña válida y usuario no repetido (case insensitive)
    if (
      hayDatos(pNombre) &&
      hayDatos(pNombreUsuario) &&
      hayDatos(pContrasenia) &&
      hayDatos(pNombrePerro) &&
      hayDatos(pTamanioPerro) &&
      contraseniaValida(pContrasenia) &&
      this.obtenerClientePorNombreUsuario(pNombreUsuario) === null
    ) {
      // Crear instancia de Cliente y agregar a la lista (normaliza nombreUsuario a lowercase en Cliente)
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
    if (!nick) return null;
    nick = nick.toLowerCase();
    return this.clientes.find(c => c.nombreUsuario === nick) || null;
  }

  loginCliente(nick, pass) {
    if (!nick || !pass) return false;
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
    // Ajusté para agregar parámetros completos a constructor Paseador 
    this.paseadores.push(new Paseador("maria", "1234", 16, "grande", "", "Maria Lopez", "Experta paseadora", 5));
    this.paseadores.push(new Paseador("carlos", "1234", 16, "grande", "", "Carlos Mendez", "Amante de los perros grandes", 4));
    this.paseadores.push(new Paseador("lucia", "1234", 8, "mediano", "", "Lucia Fernandez", "Especialista en perros medianos", 4));
    this.paseadores.push(new Paseador("julian", "1234", 4, "chico", "", "Julian Perez", "Cuida perros chicos con cariño", 3));
  }

  obtenerPaseadorPorNombreUsuario(nick) {
    if (!nick) return null;
    nick = nick.toLowerCase();
    return this.paseadores.find(p => p.nombreUsuario === nick) || null;
  }

  loginPaseador(nick, pass) {
    if (!nick || !pass) return false;
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
    if (!cliente) return false;
    return this.contrataciones.some(
      c => c.cliente.id === cliente.id && c.estado === "Pendiente"
    );
  }

  obtenerContratacionesCliente(cliente) {
    if (!cliente) return [];
    return this.contrataciones.filter(c => c.cliente.id === cliente.id);
  }

  obtenerContratacionesPaseador(paseador) {
    if (!paseador) return [];
    return this.contrataciones.filter(c => c.paseador.id === paseador.id);
  }

  contarCuposUsados(paseador) {
    if (!paseador) return 0;
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
    return 1;  // chico o por defecto
  }

  tieneCupoDisponible(paseador, tamPerro) {
    if (!paseador || !tamPerro) return false;

    // Para seguridad, paseador solo puede tener perros del mismo tamaño o vacíos
    if (paseador.tamanioPerro !== tamPerro) return false;

    let cuposUsados = this.contarCuposUsados(paseador);
    let cuposNecesarios = this.obtenerCuposPorTamanio(tamPerro);

    return (cuposUsados + cuposNecesarios) <= paseador.cupos;
  }

  obtenerPaseadoresDisponibles(tamPerro) {
    if (!tamPerro) return [];
    return this.paseadores.filter(p => this.tieneCupoDisponible(p, tamPerro));
  }

  agregarContratacion(cliente, paseador) {
    if (!cliente || !paseador) return false;
    if (this.tieneContratacionPendienteCliente(cliente)) return false;
    this.contrataciones.push(new Contratacion(cliente, paseador));
    return true;
  }

  cancelarReservaPendiente(cliente) {
    if (!cliente) return false;
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
      c.estado = "Rechazada"; // sin cupo
      return false;
    }

    c.estado = "Aprobada";

    // Rechaza todas las pendientes que no caben porque ya se quedó sin cupo
    if (this.contarCuposUsados(p) >= p.cupos) {
      this.contrataciones.forEach(otro => {
        if (otro.paseador.id === p.id && otro.estado === "Pendiente") {
          otro.estado = "Rechazada";
        }
      });
    }

    // Rechaza las incompatibles (mezcla de perros chicos y grandes)
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
    if (!paseador) return 0;
    return paseador.cupos - this.contarCuposUsados(paseador);
  }

  obtenerContratacionesPendientesPorPaseador(nick) {
    if (!nick) return [];
    nick = nick.toLowerCase();
    return this.contrataciones.filter(
      c => c.paseador.nombreUsuario === nick && c.estado === "Pendiente"
    );
  }

  obtenerPerrosAsignados(nick) {
    if (!nick) return [];
    nick = nick.toLowerCase();
    return this.contrataciones
      .filter(c => c.paseador.nombreUsuario === nick && c.estado === "Aprobada")
      .map(c => c.cliente);
  }

  resumenCupoPaseador(nick) {
    if (!nick) return { ocupados: 0, maximo: 0, porcentaje: "0" };
    const p = this.obtenerPaseadorPorNombreUsuario(nick);
    if (!p) return { ocupados: 0, maximo: 0, porcentaje: "0" };

    let ocupados = this.contarCuposUsados(p);
    return {
      ocupados,
      maximo: p.cupos,
      porcentaje: ((ocupados / p.cupos) * 100).toFixed(0)
    };
  }
}