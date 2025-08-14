// 🔹 Utilidades
function convertDate(input) {
    const match = input.match(/\/Date\((\d+)\)\//);
    if (match) {
        const milliseconds = parseInt(match[1]);
        return new Date(milliseconds);
    }
    return null;
}

const imagenesBandas = {
    "coldplay": "https://link-a-la-imagen.com/coldplay.jpg",
    "metallica": "https://link-a-la-imagen.com/metallica.jpg"
};

// 🔹 Funciones de autenticación
function Autenticar() {
    const usu = document.getElementById('txtUsuario').value;
    const pass = document.getElementById('txtPassword').value;

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/Empresa/VerificarUsuario',
        data: { usuario: usu, password: pass },
        success: function (respuesta) {
            console.log(respuesta);
            if (respuesta.Estado === 'OK') {
                window.location.replace('/Empresa/Login');
            } else {
                document.getElementById('lblMensaje').innerHTML = 'Usuario o contraseña incorrectos';
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

function CerrarSesion() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/Empresa/CerrarSesion',
        data: {},
        success: function (respuesta) {
            console.log(respuesta);
            if (respuesta.Estado === 'OK') {
                window.location.replace('/Empresa/Inicio');
            } else {
                alert('No se pudo cerrar sesión');
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

// 🔹 Función para crear conciertos
function ProcesarCreacion() {
    const datos = {
        codigo: document.getElementById('txtCodigo').value,
        banda: document.getElementById('txtBanda').value,
        genero: document.getElementById('txtGenero').value,
        fecha: document.getElementById('txtFecha').value,
        hora: document.getElementById('txtHora').value,
        pais: document.getElementById('txtPais').value,
        lugar: document.getElementById('txtLugar').value
    };

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/Empresa/CrearConcierto',
        data: datos,
        success: function (respuesta) {
            console.log(respuesta);
            if (respuesta.Estado === 'Concierto creado exitosamente') {
                alert('Concierto creado exitosamente');
                Object.keys(datos).forEach(id => document.getElementById(`txt${id.charAt(0).toUpperCase() + id.slice(1)}`).value = '');
            } else {
                alert('Falló la creación del concierto');
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

// 🔹 Funciones para mostrar conciertos
let todosLosConciertos = [];

function ProcesarConsulta() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/Empresa/ConsultarConciertos',
        data: {},
        success: function (respuesta) {
            todosLosConciertos = respuesta.Lista || [];
            mostrarConciertos(todosLosConciertos);
        },
        error: function (error) {
            console.error('Error al cargar conciertos:', error);
        }
    });
}

function mostrarConciertos(lista) {
    const contenedor = document.getElementById('contenedorCards');
    const template = document.getElementById('templateCard');
    contenedor.innerHTML = '';

    lista.forEach((concierto, index) => {
        const clone = template.content.cloneNode(true);
        const nombreBanda = concierto.Banda?.toLowerCase().trim();
        const imgURL = imagenesBandas[nombreBanda] || 'https://via.placeholder.com/300x200?text=Concierto';

        const fechaObj = convertDate(concierto.Fecha);
        const fechaFormateada = fechaObj?.toLocaleDateString('es-CR', { day: '2-digit', month: 'long', year: 'numeric' });
        const horaFormateada = fechaObj?.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });

        const colapsableId = `detalle-${index}`;

        clone.querySelector('.card-img-top').src = imgURL;
        clone.querySelector('.card-img-top').alt = concierto.Banda;
        clone.querySelector('.card-title').textContent = concierto.Banda;
        clone.querySelector('.genero').innerHTML = `<strong>Género:</strong> ${concierto.Genero}`;
        clone.querySelector('button').setAttribute('data-bs-target', `#${colapsableId}`);
        clone.querySelector('.detalles').id = colapsableId;
        clone.querySelector('.fecha').innerHTML = `<strong>Fecha:</strong> ${fechaFormateada}`;
        clone.querySelector('.hora').innerHTML = `<strong>Hora:</strong> ${horaFormateada}`;
        clone.querySelector('.pais').innerHTML = `<strong>País:</strong> ${concierto.Pais}`;
        clone.querySelector('.lugar').innerHTML = `<strong>Lugar:</strong> ${concierto.Lugar}`;

        contenedor.appendChild(clone);
    });
}

function buscarConciertos() {
    const texto = document.getElementById('busqueda').value.toLowerCase();
    const filtrados = todosLosConciertos.filter(concierto =>
        concierto.Banda?.toLowerCase().includes(texto)
    );

    const contenedor = document.getElementById('contenedorCards');
    if (filtrados.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <p class="text-center text-muted fs-5">No se encontraron conciertos para "<strong>${texto}</strong>".</p>
            </div>
        `;
    } else {
        mostrarConciertos(filtrados);
    }
}

// 🔹 Dropdown manual
function configurarDropdown() {
    const toggleButton = document.getElementById("dropdownMenuButton");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (!toggleButton || !dropdownMenu) return;

    toggleButton.addEventListener("click", function (e) {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
    });

    document.addEventListener("click", function () {
        dropdownMenu.style.display = "none";
    });
}

// 🔹 Inicialización
document.addEventListener("DOMContentLoaded", function () {
    configurarDropdown();
    ProcesarConsulta();

    document.getElementById('btnBuscar')?.addEventListener('click', buscarConciertos);
    document.getElementById('busqueda')?.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            buscarConciertos();
        }
    });
});
function toggleDropdown() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}


function RegistrarUsuario() {
    const datos = {
        usuario: document.getElementById('txtNuevoUsuario').value,
        password: document.getElementById('txtNuevoPassword').value
    };

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/Empresa/CrearUsuario',
        data: datos,
        success: function (respuesta) {
            console.log(respuesta);
            if (respuesta.Estado === 'Usuario creado exitosamente') {
                alert('Usuario creado exitosamente');
                Object.keys(datos).forEach(id => document.getElementById(`txt${id.charAt(0).toUpperCase() + id.slice(1)}`).value = '');
            } else {
                alert('Falló la creación del usuario');
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

function mostrarConciertosTabla(lista) {
    console.log("📢 mostrarConciertosTabla() llamada con lista:", lista);

    const tbody = document.querySelector('.dashboard-table tbody');
    console.log("📢 tbody encontrado:", tbody);

    if (!tbody) {
        console.error("❌ No se encontró el tbody. Revisa el HTML.");
        return;
    }

    tbody.innerHTML = ''; // limpiar tabla

    lista.forEach((concierto, index) => {
        console.log(`🎵 Procesando concierto ${index}:`, concierto);

        const nombreBanda = concierto.Banda?.toLowerCase().trim();
        const imgURL = imagenesBandas[nombreBanda] || 'https://via.placeholder.com/100x60?text=Concierto';

        console.log(`🎨 Imagen para ${concierto.Banda}:`, imgURL);

        const fechaObj = convertDate(concierto.Fecha);
        console.log(`📅 Fecha convertida:`, fechaObj);

        const fechaFormateada = fechaObj?.toLocaleDateString('es-CR', { day: '2-digit', month: 'long', year: 'numeric' });
        const horaFormateada = fechaObj?.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>
                <button class="btn-ver" data-index="${index}">👁</button>
                <button class="btn-borrar" data-index="${index}">🗑</button>
            </td>
            <td>${concierto.Codigo || ''}</td>
            <td>
                <img src="${imgURL}" alt="${concierto.Banda}" style="width:60px;height:auto;vertical-align:middle;margin-right:5px;">
                ${concierto.Banda}
            </td>
            <td>${concierto.Genero}</td>
            <td>${fechaFormateada}</td>
            <td>${horaFormateada}</td>
            <td>${concierto.Pais}</td>
            <td>${concierto.Lugar}</td>
        `;
        tbody.appendChild(fila);
    });
}

function buscarConciertosTabla() {
    console.log("🔍 Ejecutando buscarConciertosTabla()");
    const texto = document.getElementById('busqueda').value.toLowerCase();
    console.log("🔍 Texto buscado:", texto);

    console.log("📦 todosLosConciertos actual:", todosLosConciertos);
    const filtrados = todosLosConciertos.filter(concierto =>
        concierto.Banda?.toLowerCase().includes(texto)
    );
    console.log("📊 Resultados filtrados:", filtrados);

    const tbody = document.querySelector('.dashboard-table tbody');
    if (filtrados.length === 0) {
        console.warn("⚠ No se encontraron conciertos");
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted">
                    No se encontraron conciertos para "<strong>${texto}</strong>".
                </td>
            </tr>
        `;
    } else {
        mostrarConciertosTabla(filtrados);
    }
}

