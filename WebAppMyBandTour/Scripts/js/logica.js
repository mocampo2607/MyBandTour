function ProcesarCreacion() {
    let codigo = document.getElementById('txtCodigo').value;
    let banda = document.getElementById('txtBanda').value;
    let genero = document.getElementById('txtGenero').value;
    let fecha = document.getElementById('txtFecha').value;
    let hora = document.getElementById('txtHora').value;
    let pais = document.getElementById('txtPais').value;
    let lugar = document.getElementById('txtLugar').value;

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/Empresa/CrearConcierto',
        data: {
            codigo: codigo,
            banda: banda,
            genero: genero,
            fecha: fecha,
            hora: hora,
            pais: pais,
            lugar: lugar
        },
        success: function (respuesta) {
            console.log(respuesta);
            if (respuesta.Estado === 'Concierto creado exitosamente') {
                alert('Concierto creado exitosamente');

                document.getElementById('txtCodigo').value = '';
                document.getElementById('txtBanda').value = '';
                document.getElementById('txtGenero').value = '';
                document.getElementById('txtFecha').value = '';
                document.getElementById('txtHora').value = '';
                document.getElementById('txtPais').value = '';
                document.getElementById('txtLugar').value = '';
            } else {
                alert('Falló la creación del concierto');
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {

    let todosLosConciertos = [];

    // Convierte la fecha del formato JSON de .NET
    function convertDate(input) {
        const match = input.match(/\/Date\((\d+)\)\//);
        if (match) {
            const milliseconds = parseInt(match[1]);
            return new Date(milliseconds);
        }
        return null;
    }

    // Diccionario de imágenes por nombre de banda
    const imagenesBandas = {
        "coldplay": "https://link-a-la-imagen.com/coldplay.jpg",
        "metallica": "https://link-a-la-imagen.com/metallica.jpg"
    };

    // Carga los conciertos desde el backend
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

    // Muestra las cards de conciertos
    function mostrarConciertos(lista) {
        const contenedor = document.getElementById('contenedorCards');
        const template = document.getElementById('templateCard');
        contenedor.innerHTML = '';

        lista.forEach((concierto, index) => {
            const clone = template.content.cloneNode(true);
            const nombreBanda = concierto.Banda?.toLowerCase().trim();
            const imgURL = imagenesBandas[nombreBanda] || 'https://via.placeholder.com/300x200?text=Concierto';

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

            const colapsableId = `detalle-${index}`;

            // Llenar datos
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

    // Busca conciertos por nombre de banda y muestra resultado o mensaje si no hay coincidencias
    function buscarConciertos() {
        const texto = document.getElementById('busqueda').value.toLowerCase();
        const filtrados = todosLosConciertos.filter(concierto =>
            concierto.Banda?.toLowerCase().includes(texto)
        );

        if (filtrados.length === 0) {
            const contenedor = document.getElementById('contenedorCards');
            contenedor.innerHTML = `
                <div class="col-12">
                    <p class="text-center text-muted fs-5">No se encontraron conciertos para "<strong>${texto}</strong>".</p>
                </div>
            `;
        } else {
            mostrarConciertos(filtrados);
        }
    }

    // Asignación de eventos
    document.getElementById('btnBuscar').addEventListener('click', buscarConciertos);

    document.getElementById('busqueda').addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            buscarConciertos();
        }
    });

    // Carga inicial de conciertos
    ProcesarConsulta();

});
