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
  document.querySelector("#aVerPaseadores")
          .addEventListener("click", mostrarListadoPaseadoresUI);

  /* Navegación – paseador */
  document.querySelector("#aGestionarContratacionesPaseador")
          .addEventListener("click", mostrarVistaGestionPaseador);

  document.querySelector("#aVerPerrosAsignadosPaseador")
          .addEventListener("click", mostrarVistaVerPerrosAsignados);

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

  /* Filtro de paseadores */
  document.querySelector("#btnAplicarFiltro")
          .addEventListener("click", cargarListadoPaseadoresUI);
  
  /* Filtro de cancelar reserva */
  document.querySelector("#btnCancelarReserva")
        .addEventListener("click", cancelarReservaUI);
  
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
    "divListadoPaseadores",
    "divMiReservaCliente"
  ].forEach(ocultarElemento);

  // Ocultar nav y todos sus botones
  ocultarElemento("navPrincipal");
  [
    "liContratarPaseadorCliente",
    "liVerReservaCliente",
    "liVerPaseadoresCliente",
    "liGestionarContratacionesPaseador",
    "liVerPerrosAsignadosPaseador",
    "liCerrarSesion"
  ].forEach(ocultarElemento);
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
  mostrarElemento("divMiReservaCliente");
  mostrarReservaClienteUI();
}

function cancelarReservaUI() {
  if (sistema.cancelarReservaPendiente(sistema.usuarioLogueado)) {
    alert("Reserva cancelada con éxito.");
  } else {
    alert("No tiene una reserva pendiente para cancelar.");
  }
  mostrarVistaMiReserva();
}

function mostrarVistaGestionPaseador() {
  ocultarTodo();
  mostrarElemento("navPrincipal");
  mostrarBotonesPaseador();
  mostrarElemento("divGestionarContrataciones");
  mostrarSolicitudesPaseadorUI();
}

// ** Nueva función para mostrar la vista "Ver perros asignados" **
function mostrarVistaVerPerrosAsignados() {
  ocultarTodo();
  mostrarElemento("navPrincipal");
  mostrarBotonesPaseador();
  mostrarElemento("divVerPerrosAsignados");
  mostrarPerrosAsignadosUI();
}

/////////////////////////////////////////////////////////
// MENÚ BOTONES VISIBILIDAD
/////////////////////////////////////////////////////////

function mostrarBotonesCliente() {
  mostrarElemento("liContratarPaseadorCliente");
  mostrarElemento("liVerReservaCliente");
  mostrarElemento("liVerPaseadoresCliente");
  mostrarElemento("liCerrarSesion");
  ocultarElemento("liGestionarContratacionesPaseador");
  ocultarElemento("liVerPerrosAsignadosPaseador");
}

function mostrarBotonesPaseador() {
  mostrarElemento("liGestionarContratacionesPaseador");
  mostrarElemento("liVerPerrosAsignadosPaseador"); 
  mostrarElemento("liCerrarSesion");
  ocultarElemento("liContratarPaseadorCliente");
  ocultarElemento("liVerReservaCliente");
  ocultarElemento("liVerPaseadoresCliente");
}

/////////////////////////////////////////////////////////
// LISTADO PASEADORES
/////////////////////////////////////////////////////////
function mostrarListadoPaseadoresUI() {
  ocultarTodo();
  mostrarElemento("navPrincipal");
  mostrarBotonesCliente();
  mostrarElemento("divListadoPaseadores");
  cargarListadoPaseadoresUI();
}

function cargarListadoPaseadoresUI() {
  const contenedor = document.getElementById("contenedorPaseadores");
  contenedor.innerHTML = "";

  const valorFiltro = document.getElementById("filtroTamanio").value;

  let paseadoresFiltrados = [];

  if (valorFiltro === "todos") {
    paseadoresFiltrados = sistema.paseadores;
  } else {
    paseadoresFiltrados = sistema.paseadores.filter(p => p.tamanioPerro === valorFiltro);
  }

  for (const p of paseadoresFiltrados) {
    contenedor.innerHTML += `
      <div class="card-paseador">
        <h3>${p.nombreCompleto}</h3>
        <p><strong>Usuario:</strong> ${p.nombreUsuario}</p>
        <p><strong>Tamaño:</strong> ${p.tamanioPerro}</p>
        <p><strong>Descripción:</strong> ${p.descripcion}</p>
        <p><strong>Estrellas:</strong> ${"⭐".repeat(p.estrellas)}</p>
      </div>
    `;
  }

  if (paseadoresFiltrados.length === 0) {
    contenedor.innerHTML = "<p>No hay paseadores para ese tamaño.</p>";
  }
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

  // Limpiar la vista de reserva para evitar mostrar info vieja
  let pInfo = document.getElementById("infoReservaCliente");
  let btnCancelar = document.getElementById("btnCancelarReserva");
  if (pInfo) pInfo.textContent = "";
  if (btnCancelar) btnCancelar.style.display = "none";

  // Ocultar la sección "Mi reserva"
  ocultarElemento("divMiReservaCliente");
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
// FUNCIONES DE CONTRATACIÓN Y RESERVAS
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
  let div = document.getElementById("divMiReservaCliente");
  if (!div) return;

  let pInfo = document.getElementById("infoReservaCliente");
  let btnCancelar = document.getElementById("btnCancelarReserva");

  if (lista.length === 0) {
    pInfo.textContent = "No posee contrataciones.";
    btnCancelar.style.display = "none";
  } else {
    pInfo.innerHTML =
      `<table>
        <thead><tr><th>Paseador</th><th>Estado</th></tr></thead>
        <tbody>
          ${lista.map(c =>
            `<tr><td>${c.paseador.nombreUsuario}</td><td>${c.estado}</td></tr>`
          ).join("")}
        </tbody>
      </table>`;

    // Mostrar botón cancelar solo si hay alguna reserva pendiente
    const tienePendiente = lista.some(c => c.estado === "Pendiente");
    btnCancelar.style.display = tienePendiente ? "inline-block" : "none";
  }
}

/////////////////////////////////////////////////////////
// FUNCIONES PASEADOR
/////////////////////////////////////////////////////////

// Mostrar solicitudes pendientes y aprobadas (botones aprobar/rechazar)
function mostrarSolicitudesPaseadorUI() {
  let pas = sistema.usuarioLogueado;
  if (!pas) return;

  let solicitudesPendientes = sistema.obtenerContratacionesPendientesPorPaseador(pas.nombreUsuario);
  let contratacionesAprobadas = sistema.obtenerContratacionesPaseador(pas)
    .filter(c => c.estado === "Aprobada");

  let contPendientes = document.getElementById("listaSolicitudesPendientes");
  let contAprobadas = document.getElementById("listaContratacionesAprobadas");

  if (!contPendientes || !contAprobadas) return;

  if (solicitudesPendientes.length === 0) {
    contPendientes.textContent = "No hay solicitudes pendientes.";
  } else {
    contPendientes.innerHTML =
      `<table>
        <thead>
          <tr><th>ID</th><th>Cliente</th><th>Perro</th><th>Tamaño</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          ${solicitudesPendientes.map(c =>
            `<tr>
              <td>${c.id}</td>
              <td>${c.cliente.nombreUsuario}</td>
              <td>${c.cliente.nombrePerro}</td>
              <td>${c.tamanioPerro}</td>
              <td>
                <button data-id="${c.id}" data-accion="aprobar" class="btnProcesar">Aprobar</button>
                <button data-id="${c.id}" data-accion="rechazar" class="btnProcesar">Rechazar</button>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>`;
  }

  contPendientes.querySelectorAll(".btnProcesar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const accion = btn.dataset.accion;
      procesarContratacionUI(id, accion);
    });
  });

  if (contratacionesAprobadas.length === 0) {
    contAprobadas.textContent = "No tiene contrataciones aprobadas.";
  } else {
    contAprobadas.innerHTML =
      `<table>
        <thead>
          <tr><th>ID</th><th>Cliente</th><th>Perro</th><th>Tamaño</th><th>Estado</th></tr>
        </thead>
        <tbody>
          ${contratacionesAprobadas.map(c =>
            `<tr>
              <td>${c.id}</td>
              <td>${c.cliente.nombreUsuario}</td>
              <td>${c.cliente.nombrePerro}</td>
              <td>${c.tamanioPerro}</td>
              <td>${c.estado}</td>
            </tr>`).join("")}
        </tbody>
      </table>`;
  }

  mostrarPerrosAsignadosUI();
}

// Aprobar y rechazar solicitudes
function procesarContratacionUI(id, accion) {
  if (!id || !accion) return;

  if (accion === "aprobar") {
    sistema.aprobarContratacion(id);
  } else if (accion === "rechazar") {
    let c = sistema.contrataciones.find(ct => ct.id === id);
    if (c && c.estado === "Pendiente") {
      c.estado = "Rechazada";
    }
  }

  mostrarSolicitudesPaseadorUI();
}

// Mostrar perros asignados a paseador
function mostrarPerrosAsignadosUI() {
  let paseador = sistema.usuarioLogueado;
  if (!paseador) return;

  let listaPerros = sistema.obtenerPerrosAsignados(paseador.nombreUsuario);
  let ul = document.getElementById("listaPerrosAsignados");
  let pResumen = document.getElementById("pResumenCupos");

  ul.innerHTML = "";

  if (listaPerros.length === 0) {
    ul.innerHTML = "<li>No tiene perros asignados por ahora.</li>";
  } else {
    for (const cliente of listaPerros) {
      ul.innerHTML += `<li>${cliente.nombrePerro} (dueño: ${cliente.nombreUsuario})</li>`;
    }
  }

  let resumen = sistema.resumenCupoPaseador(paseador.nombreUsuario);
  pResumen.textContent = `Ocupación: ${resumen.ocupados} / ${resumen.maximo} (${resumen.porcentaje}%)`;
}