function convertDate(input) {
    const match = input.match(/\/Date\((\d+)\)\//);
    if (match) {
        const milliseconds = parseInt(match[1], 10);
        return new Date(milliseconds);
    }
    return null;
}

const imagenesBandas = {
    'coldplay': 'https://example.com/imagenes/coldplay.jpg',
    'u2': 'https://example.com/imagenes/u2.jpg',
    'maroon 5': 'https://example.com/imagenes/maroon5.jpg',
    'metallica': 'https://example.com/imagenes/metallica.jpg',
    'queen': 'https://example.com/imagenes/queen.jpg'
};
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
                let codigo = document.getElementById('txtCodigo').value = '';
                let banda = document.getElementById('txtBanda').value = '';
                let genero = document.getElementById('txtGenero').value = '';
                let fecha = document.getElementById('txtFecha').value = '';
                let hora = document.getElementById('txtHora').value = '';
                let pais = document.getElementById('txtPais').value = '';
                let lugar = document.getElementById('txtLugar').value = '';
            }
            else {
                alert('Falló la creación del concierto');
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}
function ProcesarConsulta() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/Empresa/ConsultarConciertos',
        data: {},
        success: function (respuesta) {
            console.log(respuesta);

            let contenedor = document.getElementById('contenedorCards');
            contenedor.innerHTML = '';

            respuesta.Lista.forEach(function (concierto, index) {
                let nombreBanda = concierto.Banda?.toLowerCase().trim();
                let imgURL = imagenesBandas[nombreBanda] || 'https://via.placeholder.com/300x200?text=Concierto';
                let colapsableId = `detalle-${index}`;

                let fechaObj = convertDate(concierto.Fecha);
                let fechaFormateada = fechaObj?.toLocaleDateString('es-CR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
                let horaFormateada = fechaObj?.toLocaleTimeString('es-CR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                let card = `
                            <div class="col-md-4 col-lg-3 mb-4">
                                <div class="card h-100 text-center">
                                    <img src="${imgURL}" class="card-img-top" alt="${concierto.Banda}">
                                    <div class="card-body">
                                        <h5 class="card-title">${concierto.Banda}</h5>
                                        <p><strong>Género:</strong> ${concierto.Genero}</p>

                                        <button class="btn btn-outline-primary btn-sm mb-2" data-bs-toggle="collapse" data-bs-target="#${colapsableId}">
                                            Más detalles
                                        </button>

                                        <div class="collapse" id="${colapsableId}">
                                            <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                                            <p><strong>Hora:</strong> ${horaFormateada}</p>
                                            <p><strong>País:</strong> ${concierto.Pais}</p>
                                            <p><strong>Lugar:</strong> ${concierto.Lugar}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                contenedor.insertAdjacentHTML('beforeend', card);
            });


        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}


window.onload = function () {
    ProcesarConsulta();
};