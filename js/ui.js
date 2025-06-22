window.addEventListener("load", inicio);

let sistema = new Sistema();   /* ← ya incorpora la precarga */

/////////////////////////////////////////////////////////
// INICIO
/////////////////////////////////////////////////////////
function inicio() {
  /* Login */
  document.querySelector("#btnLoginCliente")
          .addEventListener("click", loginClienteUI);
  document.querySelector("#btnLoginPaseador")
          .addEventListener("click", loginPaseadorUI);

  /* Registro */
  document.querySelector("#btnRegistrarCliente")
          .addEventListener("click", registrarClienteUI);

  /* Navegación – cliente */
  document.querySelector("#aContratarPaseadorCliente")
          .addEventListener("click", mostrarVistaContratarPaseador);
  document.querySelector("#aVerReservaCliente")
          .addEventListener("click", mostrarVistaMiReserva);

  /* Navegación – paseador */
  document.querySelector("#aGestionarContratacionesPaseador")
          .addEventListener("click", mostrarVistaGestionPaseador);

  /* Logout */
  document.querySelector("#aCerrarSesion")
          .addEventListener("click", cerrarSesionUI);

  /* Contratar paseador */
  document.querySelector("#btnContratar")
          .addEventListener("click", contratarPaseadorUI);

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
    "divMiReserva",
    "divGestionPaseador",
    "navPrincipal"
  ].forEach(ocultarElemento);
}

function prepararLogin() {
  mostrarElemento("divLogin");
  mostrarElemento("divRegistroCliente");
  ocultarElemento("navPrincipal");
  mostrarAlgoHTML("pMsgLogin", "");
  mostrarAlgoHTML("pMsgReg", "");
}

function mostrarVistaContratarPaseador() {
  ocultarTodo();
  mostrarElemento("navPrincipal");
  mostrarElemento("divContratarPaseador");
  cargarPaseadoresDisponiblesUI();
}

function mostrarVistaMiReserva() {
  ocultarTodo();
  mostrarElemento("navPrincipal");
  mostrarElemento("divMiReserva");
  mostrarReservaClienteUI();
}

function mostrarVistaGestionPaseador() {
  ocultarTodo();
  mostrarElemento("navPrincipal");
  mostrarElemento("divGestionPaseador");
  mostrarSolicitudesPaseadorUI();
}

/////////////////////////////////////////////////////////
// REGISTRO  &  LOGIN
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
// CLIENTE
/////////////////////////////////////////////////////////
function mostrarBotonesCliente() {
  mostrarElemento("navPrincipal");
  ["aContratarPaseadorCliente", "aVerReservaCliente", "aCerrarSesion"].forEach(mostrarElemento);
  ocultarElemento("aGestionarContratacionesPaseador");
}

function cargarPaseadoresDisponiblesUI() {
  let cliente = sistema.usuarioLogueado;
  if (!cliente) return;

  let cont = document.getElementById("divSelectPaseador");
  cont.innerHTML = "";

  if (sistema.tieneContratacionPendienteCliente(cliente)) {
    cont.innerHTML = "<p>Ya tiene una contratación pendiente. Cancele antes de contratar otra.</p>";
    ocultarElemento("btnContratar");
    return;
  }

  let lista = sistema.obtenerPaseadoresDisponibles(cliente.tamanioPerro);

  if (lista.length === 0) {
    cont.innerHTML = "<p>No hay paseadores disponibles para el tamaño de su perro.</p>";
    ocultarElemento("btnContratar");
    return;
  }

  /* SELECT */
  mostrarElemento("btnContratar");
  let sel = document.createElement("select");
  sel.id  = "selectPaseadores";

  sel.innerHTML = `<option value="">Seleccione un paseador…</option>` +
    lista.map(p =>
      `<option value="${p.nombreUsuario}">
        ${p.nombreUsuario} (Cupos disp.: ${sistema.cuposDisponiblesParaPaseador(p)})
       </option>`
    ).join("");

  cont.appendChild(sel);
}

function contratarPaseadorUI() {
  let select = document.getElementById("selectPaseadores");
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
  let div   = document.getElementById("divTablaReserva");

  if (lista.length === 0) {
    div.innerHTML = "<p>No posee contrataciones.</p>";
  } else {
    div.innerHTML =
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
function mostrarBotonesPaseador() {
  mostrarElemento("navPrincipal");
  ["aGestionarContratacionesPaseador", "aCerrarSesion"].forEach(mostrarElemento);
  ["aContratarPaseadorCliente", "aVerReservaCliente"].forEach(ocultarElemento);
}

function mostrarSolicitudesPaseadorUI() {
  /* implementado en la versión anterior – sin cambios */
  const pas = sistema.usuarioLogueado;
  if (!pas) return;

  let lista = sistema.obtenerContratacionesPendientesPorPaseador(pas.nombreUsuario);
  let div   = document.getElementById("divTablaPend");
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
  /* igual que la versión anterior */
  const pas = sistema.usuarioLogueado;
  if (!pas) return;

  let perros = sistema.obtenerPerrosAsignados(pas.nombreUsuario);
  let div    = document.getElementById("divTablaAsignados");
  div.innerHTML = "";

  if (perros.length === 0) {
    div.textContent = "No hay perros asignados.";
  } else {
    div.innerHTML =
      `<table>
        <thead><tr><th>Nombre</th><th>Tamaño</th></tr></thead>
        <tbody>
          ${perros.map(p =>
            `<tr><td>${p.nombrePerro}</td><td>${p.tamanioPerro}</td></tr>`
          ).join("")}
        </tbody>
      </table>`;
  }

  let res = sistema.resumenCupoPaseador(pas.nombreUsuario);
  document.getElementById("pResumenCupo").textContent =
    `Cupos ocupados: ${res.ocupados} / ${res.maximo} (${res.porcentaje}%)`;
}
