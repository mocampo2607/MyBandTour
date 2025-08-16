// 🔹 Utilidades
function convertDate(input) {
    const match = input.match(/\/Date\((\d+)\)\//);
    if (match) {
        const milliseconds = parseInt(match[1]);
        return new Date(milliseconds);
    }
    return null;
}

function formatearFecha(fecha) {
    const fechaObj = convertDate(fecha);
    if (!fechaObj) return '';
    return fechaObj.toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

const imagenesBandas = {
    "bad bunny": "/Content/img/bbconcert.jpg",
    "coldplay": "/Content/img/coldplay.jpg",
    "beele": "/Content/img/beele.jpg",
    "calibre 50": "/Content/img/calibre50.jpg",
    "maroon 5": "/Content/img/maroon5.jpg",
    "the legacy concert": "/Content/img/legacy.jpg",
    "kendrick lamar": "/Content/img/kendrick.jpg" 
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

        // Normalizar nombre de banda
        const nombreBanda = concierto.Banda?.toLowerCase().trim();
        const imgURL = imagenesBandas[nombreBanda] || 'https://via.placeholder.com/300x200?text=Concierto';
        console.log("Banda:", nombreBanda);
        console.log("Imagen URL:", imgURL);

        // Convertir fecha
        const fechaObj = convertDate(concierto.Fecha);
        const fechaFormateada = fechaObj?.toLocaleDateString('es-CR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        const horaFormateada = fechaObj?.toLocaleTimeString('es-CR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // ID único para colapsable
        const colapsableId = `detalle-${index}`;

        // Asignar contenido al clon
        const img = clone.querySelector('.card-img-top');
        if (img) {
            img.src = imgURL;
            img.alt = concierto.Banda || 'Imagen no disponible';
        }

        clone.querySelector('.card-title').textContent = concierto.Banda || 'Banda desconocida';
        clone.querySelector('.genero').innerHTML = `<strong>Género:</strong> ${concierto.Genero || 'N/A'}`;
        clone.querySelector('button').setAttribute('data-bs-target', `#${colapsableId}`);
        clone.querySelector('.detalles').id = colapsableId;
        clone.querySelector('.fecha').innerHTML = `<strong>Fecha:</strong> ${fechaFormateada || 'Sin fecha'}`;
        clone.querySelector('.hora').innerHTML = `<strong>Hora:</strong> ${horaFormateada || 'Sin hora'}`;
        clone.querySelector('.pais').innerHTML = `<strong>País:</strong> ${concierto.Pais || 'Desconocido'}`;
        clone.querySelector('.lugar').innerHTML = `<strong>Lugar:</strong> ${concierto.Lugar || 'Desconocido'}`;

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

function ConsultarConciertos() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/Empresa/ConsultarConciertos',
        success: function (respuesta) {
            const lista = respuesta.Lista;
            const tbody = document.querySelector('#tablaConciertos tbody');
            tbody.innerHTML = ''; // limpiar la tabla antes de llenar

            if (lista && lista.length > 0) {
                lista.forEach(c => {
                    const fechaObj = convertDate(c.Fecha);
                    const fechaFormateada = fechaObj
                        ? fechaObj.toLocaleDateString('es-CR', { day: '2-digit', month: 'long', year: 'numeric' })
                        : '';
                    const horaFormateada = fechaObj
                        ? fechaObj.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
                        : '';

                    const fila = `
                        <tr>
                            <td>${c.Codigo}</td>
                            <td>${c.Banda}</td>
                            <td>${c.Genero}</td>
                            <td>${fechaFormateada}</td>
                            <td>${horaFormateada}</td>
                            <td>${c.Pais}</td>
                            <td>${c.Lugar}</td>
                        </tr>
                    `;
                    tbody.innerHTML += fila;
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="7">No hay conciertos registrados</td></tr>';
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

// 🔹 Llamar automáticamente al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    configurarDropdown();
    ProcesarConsulta();
    ConsultarConciertos(); // ← se carga la tabla automáticamente
});

function ProcesarEliminacion() {
    const codigo = document.getElementById('txtCodigoBorrar').value;

    if (!codigo.trim()) {
        alert('Por favor ingrese el código del concierto a eliminar.');
        return;
    }

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/Empresa/BorrarConcierto',
        data: { codigo: codigo },
        success: function (respuesta) {
            console.log(respuesta);
            if (respuesta.Estado === 'Concierto eliminado exitosamente') {
                alert('Concierto eliminado exitosamente');
                document.getElementById('txtCodigoBorrar').value = '';
            } else {
                alert('No se pudo eliminar el concierto.');
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

