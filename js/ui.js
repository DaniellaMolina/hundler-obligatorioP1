window.addEventListener("load", inicio);

let sistema = new Sistema();

/////////////////////////////////////////////////////////
// INICIO
/////////////////////////////////////////////////////////
function inicio() {
  /* Login */
  document.querySelector("#btnLoginCliente")
          .addEventListener("click", loginClienteUI);
  document.querySelector("#btnLoginPaseador")
          .addEventListener("click", loginPaseadorUI);

  /* Volver al login desde registro */
  document.querySelector("#btnVolverLoginDesdeRegistro")
          .addEventListener("click", volverLoginDesdeRegistroUI);

  /* Registro */
  document.querySelector("#btnRegistrarCliente")
          .addEventListener("click", registrarClienteUI);

  /* Navegación – cliente */
  document.querySelector("#aContratarPaseadorCliente")
          .addEventListener("click", mostrarVistaContratarPaseador);
  document.querySelector("#aVerReservaCliente")
          .addEventListener("click", mostrarVistaMiReserva);
  document.querySelector("#aVerPaseadoresCliente")
          .addEventListener("click", mostrarListadoPaseadoresUI);

  /* Navegación – paseador */
  document.querySelector("#aGestionarContratacionesPaseador")
          .addEventListener("click", mostrarVistaGestionPaseador);

  /* Logout */
  document.querySelector("#aCerrarSesion")
          .addEventListener("click", cerrarSesionUI);

  /* Contratar paseador */
  document.querySelector("#btnContratar")
          .addEventListener("click", contratarPaseadorUI);

  /* Mostrar registro */
  document.querySelector("#linkMostrarRegistro")
          .addEventListener("click", function (e) {
    e.preventDefault();
    ocultarTodo();
    mostrarElemento("divRegistroCliente");
  });

  ocultarTodo();
  prepararLogin();
}

/////////////////////////////////////////////////////////
// VISTAS
/////////////////////////////////////////////////////////
function ocultarTodo() {
  [
    "divLogin",
    "divRegistroCliente",
    "divContratarPaseador",
    "divCancelarReserva",
    "divInfoPaseadores",
    "divGestionarContrataciones",
    "divVerPerrosAsignados",
  ].forEach(ocultarElemento);

  // Ocultar nav y todos sus botones
  ocultarElemento("navPrincipal");
  ["liContratarPaseadorCliente", "liVerReservaCliente", "liGestionarContratacionesPaseador", "liCerrarSesion"].forEach(ocultarElemento);
}

function prepararLogin() {
  mostrarElemento("divLogin");
  ocultarElemento("divRegistroCliente");
  ocultarElemento("navPrincipal");
  mostrarAlgoHTML("pMsgLogin", "");
  mostrarAlgoHTML("pMsgReg", "");
}

function mostrarVistaContratarPaseador() {
  ocultarTodo();
  mostrarElemento("navPrincipal");
  mostrarBotonesCliente();
  mostrarElemento("divContratarPaseador");
  cargarPaseadoresDisponiblesUI();
}

function mostrarVistaMiReserva() {
  ocultarTodo();
  mostrarElemento("navPrincipal");
  mostrarBotonesCliente();
  mostrarElemento("divCancelarReserva");
  mostrarReservaClienteUI();
}

function mostrarVistaGestionPaseador() {
  ocultarTodo();
  mostrarElemento("navPrincipal");
  mostrarBotonesPaseador();
  mostrarElemento("divGestionarContrataciones");
  mostrarSolicitudesPaseadorUI();
}

/////////////////////////////////////////////////////////
// REGISTRO & LOGIN
/////////////////////////////////////////////////////////
function registrarClienteUI() {
  let nombrePerro = obtenerValorDeUnCampo("txtNombrePerro");
  let usuario     = obtenerValorDeUnCampo("txtUsuReg");
  let pass        = obtenerValorDeUnCampo("txtPassReg");
  let tamanio     = obtenerValorDeUnCampo("slcTam");

  let errores = [];

  if (!hayDatos(nombrePerro))   errores.push("Debe ingresar el nombre del perro.");
  if (!hayDatos(usuario))       errores.push("Debe ingresar un nombre de usuario.");
  if (!hayDatos(pass))          errores.push("Debe ingresar una contraseña.");
  if (!hayDatos(tamanio))       errores.push("Debe seleccionar el tamaño del perro.");
  if (!contraseniaValida(pass)) errores.push("La contraseña debe tener al menos 5 caracteres, incluyendo mayúscula, minúscula y número.");
  if (sistema.obtenerClientePorNombreUsuario(usuario) !== null) errores.push("El usuario ya existe.");

  let mensaje = "";

  if (errores.length === 0) {
    let ok = sistema.agregarCliente(nombrePerro, usuario, pass, usuario, tamanio);
    mensaje = ok ? "¡Registro exitoso!" : "Error al registrar cliente.";
    if (ok) {
      ["txtNombrePerro", "txtUsuReg", "txtPassReg"].forEach(limpiarCampo);
      document.querySelector("#slcTam").value = "";
    }
  } else {
    mensaje = "<ul>" + errores.map(e => `<li>${e}</li>`).join("") + "</ul>";
  }
  mostrarAlgoHTML("pMsgReg", mensaje);
}

function volverLoginDesdeRegistroUI() {
  ocultarTodo();
  prepararLogin();
}

function loginClienteUI() {
  let usuario = obtenerValorDeUnCampo("txtUsuLogin");
  let pass    = obtenerValorDeUnCampo("txtPassLogin");

  let ok = hayDatos(usuario) && hayDatos(pass) && sistema.loginCliente(usuario, pass);

  if (ok) {
    mostrarBotonesCliente();
    mostrarVistaContratarPaseador();
    mostrarAlgoHTML("pMsgLogin", "");
  } else {
    mostrarAlgoHTML("pMsgLogin", "Usuario y/o contraseña inválida.");
  }
}

function loginPaseadorUI() {
  let usuario = obtenerValorDeUnCampo("txtUsuLogin");
  let pass    = obtenerValorDeUnCampo("txtPassLogin");

  let ok = hayDatos(usuario) && hayDatos(pass) && sistema.loginPaseador(usuario, pass);

  if (ok) {
    mostrarBotonesPaseador();
    mostrarVistaGestionPaseador();
    mostrarAlgoHTML("pMsgLogin", "");
  } else {
    mostrarAlgoHTML("pMsgLogin", "Usuario y/o contraseña inválida.");
  }
}

function cerrarSesionUI() {
  sistema.usuarioLogueado = null;
  ocultarTodo();
  prepararLogin();
}

/////////////////////////////////////////////////////////
// MENÚ BOTONES VISIBILIDAD
/////////////////////////////////////////////////////////
function mostrarBotonesCliente() {
  mostrarElemento("liContratarPaseadorCliente");
  mostrarElemento("liVerReservaCliente");
  mostrarElemento("liVerPaseadores"); 
  mostrarElemento("liCerrarSesion");
  ocultarElemento("liGestionarContratacionesPaseador");
}

function mostrarBotonesPaseador() {
  mostrarElemento("liGestionarContratacionesPaseador");
  mostrarElemento("liCerrarSesion");
  ocultarElemento("liContratarPaseadorCliente");
  ocultarElemento("liVerReservaCliente");
}

//Agregado por Caro: Controla la visualización del listado completo de paseadores para el perfil cliente.
function mostrarListadoPaseadoresUI() {
  ocultarTodo();
  mostrarElemento("navPrincipal");
  mostrarBotonesCliente();
  mostrarElemento("divListadoPaseadores");
  cargarListadoPaseadoresUI(); 
}

/////////////////////////////////////////////////////////
// REGISTRO & LOGIN
/////////////////////////////////////////////////////////
function registrarClienteUI() {
  let nombrePerro = obtenerValorDeUnCampo("txtNombrePerro");
  let usuario     = obtenerValorDeUnCampo("txtUsuReg");
  let pass        = obtenerValorDeUnCampo("txtPassReg");
  let tamanio     = obtenerValorDeUnCampo("slcTam");

  let errores = [];

  if (!hayDatos(nombrePerro))   errores.push("Debe ingresar el nombre del perro.");
  if (!hayDatos(usuario))       errores.push("Debe ingresar un nombre de usuario.");
  if (!hayDatos(pass))          errores.push("Debe ingresar una contraseña.");
  if (!hayDatos(tamanio))       errores.push("Debe seleccionar el tamaño del perro.");
  if (!contraseniaValida(pass)) errores.push("La contraseña debe tener al menos 5 caracteres, incluyendo mayúscula, minúscula y número.");
  if (sistema.obtenerClientePorNombreUsuario(usuario) !== null) errores.push("El usuario ya existe.");

  let mensaje = "";

  if (errores.length === 0) {
    let ok = sistema.agregarCliente(nombrePerro, usuario, pass, usuario, tamanio);
    mensaje = ok ? "¡Registro exitoso!" : "Error al registrar cliente.";
    if (ok) {
      ["txtNombrePerro", "txtUsuReg", "txtPassReg"].forEach(limpiarCampo);
      document.querySelector("#slcTam").value = "";
    }
  } else {
    mensaje = "<ul>" + errores.map(e => `<li>${e}</li>`).join("") + "</ul>";
  }
  mostrarAlgoHTML("pMsgReg", mensaje);
}

function volverLoginDesdeRegistroUI() {
  ocultarTodo();
  prepararLogin();
}

function loginClienteUI() {
  let usuario = obtenerValorDeUnCampo("txtUsuLogin");
  let pass    = obtenerValorDeUnCampo("txtPassLogin");

  let ok = hayDatos(usuario) && hayDatos(pass) && sistema.loginCliente(usuario, pass);

  if (ok) {
    mostrarBotonesCliente();
    mostrarVistaContratarPaseador();
    mostrarAlgoHTML("pMsgLogin", "");
  } else {
    mostrarAlgoHTML("pMsgLogin", "Usuario y/o contraseña inválida.");
  }
}

function loginPaseadorUI() {
  let usuario = obtenerValorDeUnCampo("txtUsuLogin");
  let pass    = obtenerValorDeUnCampo("txtPassLogin");

  let ok = hayDatos(usuario) && hayDatos(pass) && sistema.loginPaseador(usuario, pass);

  if (ok) {
    mostrarBotonesPaseador();
    mostrarVistaGestionPaseador();
    mostrarAlgoHTML("pMsgLogin", "");
  } else {
    mostrarAlgoHTML("pMsgLogin", "Usuario y/o contraseña inválida.");
  }
}

function cerrarSesionUI() {
  sistema.usuarioLogueado = null;
  ocultarTodo();
  prepararLogin();
}


/////////////////////////////////////////////////////////
// FUNCIONES AUXILIARES
/////////////////////////////////////////////////////////

function ocultarElemento(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("oculto");
}

function mostrarElemento(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("oculto");
}

function mostrarAlgoHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function obtenerValorDeUnCampo(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function hayDatos(valor) {
  return valor !== null && valor !== undefined && valor.length > 0;
}

function limpiarCampo(id) {
  const el = document.getElementById(id);
  if (el) el.value = "";
}

function contraseniaValida(pass) {
  // al menos 5 caracteres, una mayúscula, una minúscula y un número
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/.test(pass);
}

/////////////////////////////////////////////////////////
// CLIENTE
/////////////////////////////////////////////////////////

function cargarPaseadoresDisponiblesUI() {
  let cliente = sistema.usuarioLogueado;
  if (!cliente) return;

  let cont = document.getElementById("divContratarPaseador");
  if (!cont) return;

  let select = document.getElementById("slcPaseadores");
  select.innerHTML = "";

  if (sistema.tieneContratacionPendienteCliente(cliente)) {
    cont.querySelector("#pMsgContratar").textContent = "Ya tiene una contratación pendiente. Cancele antes de contratar otra.";
    ocultarElemento("btnContratar");
    return;
  }

  let lista = sistema.obtenerPaseadoresDisponibles(cliente.tamanioPerro);

  if (lista.length === 0) {
    cont.querySelector("#pMsgContratar").textContent = "No hay paseadores disponibles para el tamaño de su perro.";
    ocultarElemento("btnContratar");
    return;
  }

  cont.querySelector("#pMsgContratar").textContent = "";
  mostrarElemento("btnContratar");

  let opciones = `<option value="">Seleccione un paseador…</option>` +
    lista.map(p =>
      `<option value="${p.nombreUsuario}">${p.nombreUsuario} (Cupos disp.: ${sistema.cuposDisponiblesParaPaseador(p)})</option>`
    ).join("");

  select.innerHTML = opciones;
}

function contratarPaseadorUI() {
  let select = document.getElementById("slcPaseadores");
  if (!select || select.value === "") {
    alert("Debe seleccionar un paseador.");
    return;
  }

  let paseador = sistema.obtenerPaseadorPorNombreUsuario(select.value);
  let ok       = sistema.agregarContratacion(sistema.usuarioLogueado, paseador);

  if (ok) {
    alert("Solicitado. Espere la aprobación del paseador.");
    mostrarVistaMiReserva();
  } else {
    alert("No se pudo solicitar: ya tiene una contratación pendiente o no hay cupo.");
  }
}

function mostrarReservaClienteUI() {
  let lista = sistema.obtenerContratacionesCliente(sistema.usuarioLogueado);
  let div   = document.getElementById("divCancelarReserva");
  if (!div) return;

  if (lista.length === 0) {
    div.querySelector("#pInfoReserva").textContent = "No posee contrataciones.";
  } else {
    div.querySelector("#pInfoReserva").innerHTML =
      `<table>
        <thead><tr><th>Paseador</th><th>Estado</th></tr></thead>
        <tbody>
          ${lista.map(c =>
            `<tr><td>${c.paseador.nombreUsuario}</td><td>${c.estado}</td></tr>`
          ).join("")}
        </tbody>
      </table>`;
  }
}

/////////////////////////////////////////////////////////
// PASEADOR
/////////////////////////////////////////////////////////

function mostrarSolicitudesPaseadorUI() {
  const pas = sistema.usuarioLogueado;
  if (!pas) return;

  let lista = sistema.obtenerContratacionesPendientesPorPaseador(pas.nombreUsuario);
  let div   = document.getElementById("divGestionarContrataciones");
  if (!div) return;

  div.innerHTML = "";

  if (lista.length === 0) {
    div.textContent = "No hay solicitudes pendientes.";
  } else {
    div.innerHTML =
      `<table>
        <thead><tr><th>ID</th><th>Cliente</th><th>Perro</th><th>Tamaño</th><th></th></tr></thead>
        <tbody>
          ${lista.map(c =>
            `<tr>
              <td>${c.id}</td>
              <td>${c.cliente.nombreUsuario}</td>
              <td>${c.cliente.nombrePerro}</td>
              <td>${c.tamanioPerro}</td>
              <td><button data-id="${c.id}" class="btnProcesar">Procesar</button></td>
            </tr>`).join("")}
        </tbody>
      </table>`;

    div.querySelectorAll(".btnProcesar").forEach(btn => {
      btn.addEventListener("click", () =>
        procesarContratacionUI(Number(btn.dataset.id))
      );
    });
  }
  mostrarPerrosAsignadosUI();
}

function procesarContratacionUI(id) {
  sistema.aprobarContratacion(id);
  mostrarSolicitudesPaseadorUI();
}

function mostrarPerrosAsignadosUI() {
  const pas = sistema.usuarioLogueado;
  if (!pas) return;

  let perros = sistema.obtenerPerrosAsignados(pas.nombreUsuario);
  let div    = document.getElementById("divVerPerrosAsignados");
  if (!div) return;

  let ul = div.querySelector("#listaPerrosAsignados");
  if (!ul) return;

  ul.innerHTML = "";

  if (perros.length === 0) {
    ul.textContent = "No hay perros asignados.";
  } else {
    ul.innerHTML =
      perros.map(p =>
        `<li>${p.nombrePerro} (${p.tamanioPerro})</li>`
      ).join("");
  }

  let res = sistema.resumenCupoPaseador(pas.nombreUsuario);
  let pResumen = document.getElementById("pResumenCupos");
  if (pResumen) {
    pResumen.textContent =
      `Cupos ocupados: ${res.ocupados} / ${res.maximo} (${res.porcentaje}%)`;
  }
}