/////////////////////////////////////////////////////////
// SISTEMA 
/////////////////////////////////////////////////////////

class Sistema {
  constructor() {
    this.clientes        = [];
    this.paseadores      = [];
    this.contrataciones  = [];
    this.usuarioLogueado = null;

    this.precargaPaseadores();
    this.precargaClientes();
    this.precargaContrataciones();
  }

  ///////////////////////////////////////////////////////
  // CLIENTES
  ///////////////////////////////////////////////////////
  precargaClientes() {
    const nombresPerros = ["Max", "Bella", "Luna", "Charlie", "Lucy", "Cooper", "Daisy", "Buddy", "Molly", "Rocky", "Coco", "Bear", "Sadie", "Toby", "Lola", "Duke", "Zoe", "Jack", "Maggie", "Oliver"];
    const tamanios = ["chico", "mediano", "grande"];
    for (let i = 0; i < 20; i++) {
      const tamanio = tamanios[Math.floor(Math.random() * tamanios.length)];
      this.agregarCliente(
        nombresPerros[i],
        `cliente${i+1}`,
        `Pass${i+1}`,
        `Cliente ${i+1}`,
        tamanio
      );
    }
  }

  agregarCliente(pNombrePerro, pNombreUsuario, pContrasenia, pNombre, pTamanioPerro) {
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
    this.paseadores.push(new Paseador("maria", "1234", 16, "grande", "", "Maria Lopez", "Experta paseadora", 5));
    this.paseadores.push(new Paseador("carlos", "1234", 16, "grande", "", "Carlos Mendez", "Amante de los perros grandes", 4));
    this.paseadores.push(new Paseador("lucia", "1234", 8, "mediano", "", "Lucia Fernandez", "Especialista en perros medianos", 4));
    this.paseadores.push(new Paseador("julian", "1234", 4, "chico", "", "Julian Perez", "Cuida perros chicos con cariño", 3));
    this.paseadores.push(new Paseador("ana", "1234", 12, "mediano", "", "Ana Gutierrez", "Paseadora de perros medianos", 4));
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

  obtenerPaseadores() {
  return this.paseadores;
  }

  ///////////////////////////////////////////////////////
  // CONTRATACIONES
  ///////////////////////////////////////////////////////

  precargaContrataciones() {
    if (this.clientes.length === 0 || this.paseadores.length === 0) return;

    const estados = ["Pendiente", "Aprobada", "Rechazada"];

    for (let i = 0; i < 10; i++) {
      let cliente = this.clientes[i % this.clientes.length]; 
      let paseador = this.paseadores[i % this.paseadores.length]; 
      let estado = estados[i % estados.length]; 

      let contratacion = new Contratacion(cliente, paseador);
      contratacion.estado = estado;

      if (estado === "Aprobada") {
        paseador.agregarContratacionAprobada(contratacion);
      }

      this.contrataciones.push(contratacion);
    }
  }

  tieneContratacionPendienteCliente(cliente) {
    if (!cliente) return false;
    return this.contrataciones.some(c => c.cliente.id === cliente.id && c.estado === "Pendiente");
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
    return this.contrataciones.reduce((acc, c) =>
      c.paseador.id === paseador.id && c.estado === "Aprobada"
        ? acc + this.obtenerCuposPorTamanio(c.tamanioPerro)
        : acc, 0);
  }

  obtenerCuposPorTamanio(tam) {
    if (tam === "grande") return 4;
    if (tam === "mediano") return 2;
    return 1;
  }

  tieneCupoDisponible(paseador, tamPerro) {
    if (!paseador || !tamPerro) return false;
    if (paseador.tamanioPerro !== tamPerro) return false;

    let usados = this.contarCuposUsados(paseador);
    let necesarios = this.obtenerCuposPorTamanio(tamPerro);
    return (usados + necesarios) <= paseador.cuposMaximos;
  }

  obtenerPaseadoresDisponibles(tamPerro) {
    return this.paseadores.filter(p => this.tieneCupoDisponible(p, tamPerro));
  }

  agregarContratacion(cliente, paseador) {
    if (!cliente || !paseador) return false;
    if (this.tieneContratacionPendienteCliente(cliente)) return false;
    this.contrataciones.push(new Contratacion(cliente, paseador));
    return true;
  }

  cancelarReservaPendiente(cliente) {
    let c = this.contrataciones.find(con => con.cliente.id === cliente.id && con.estado === "Pendiente");
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
      c.estado = "Rechazada";
      return false;
    }

    c.estado = "Aprobada";
    p.agregarContratacionAprobada(c);

    if (p.cuposDisponibles <= 0) {
      this.contrataciones.forEach(otro => {
        if (otro.paseador.id === p.id && otro.estado === "Pendiente") {
          otro.estado = "Rechazada";
        }
      });
    }

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
    return paseador.cuposMaximos - this.contarCuposUsados(paseador);
  }

  obtenerContratacionesPendientesPorPaseador(nick) {
    if (!nick) return [];
    nick = nick.toLowerCase();
    return this.contrataciones.filter(c => c.paseador.nombreUsuario === nick && c.estado === "Pendiente");
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
      maximo: p.cuposMaximos,
      porcentaje: ((ocupados / p.cuposMaximos) * 100).toFixed(0)
    };
  }
}