const dominio = window.location.origin;
document.addEventListener("DOMContentLoaded", () => {
    iniciarApp();
});


const iniciarApp = () => {
    repetidor();
    buscador();
}

let buscadorActual = "";
const buscador = () => {
    const selectBuscador = document.querySelector("#buscador");
    const tituloBuscador = document.querySelector("#titulo-buscador");
    const inputsDIV = document.querySelector("#inputs");

    buscadorActual = "hoy";

    selectBuscador.addEventListener("input", (e) => {

        inputsDIV.innerHTML = "";

        switch (e.target.value) {
            case "hoy":
                tituloBuscador.textContent = "Citas de Hoy";

                let citasHoyArr = buscador_hoy(citasArr);
                renderCitas(citasHoyArr);
                break;

            case "fecha":
                tituloBuscador.textContent = "Citas por Fecha";

                inputsDIV.innerHTML = `<input type="date" id="input-date">`;

                const fechaInput = document.querySelector("#input-date");

                let citasFechaArr = [];
                fechaInput.addEventListener("input", (e) => {
                    citasFechaArr = buscador_fecha(citasArr, e.target.value);
                    renderCitas(citasFechaArr);
                });

                break;

            case "todas":
                tituloBuscador.textContent = "Todas las Citas";

                buscador_todas();
                renderCitas(citasArr);
                break;
            default:
                break;
        }
    });
}


const fecha = new Date();
const fechaHoy = fecha.getFullYear()  + '-' + ( fecha.getMonth() + 1 ) + '-' + fecha.getDate();
const buscador_hoy = (citasArr) => {
    buscadorActual = "hoy";
    citasHoyArr = citasArr.filter(cita => cita.fecha == fechaHoy);
    return citasHoyArr;
}


const buscador_fecha = (citasArr, fecha) => {
    buscadorActual = "fecha";

    citasFechaArr = citasArr.filter(cita => cita.fecha == fecha);
    return citasFechaArr;
}


const buscador_todas = () => { buscadorActual = "todas" }


// Lo usamos para actualizar las citas cada "n" segundos.
const repetidor = () => {
    setInterval(() => {
        citasAPI();
        actualizarCitas();
    }, 2000);
}

let citasRenderizadas = 0;
const actualizarCitas = () => {

    if(citasArr.length != citasRenderizadas){
        citasAPI();
        citasRenderizadas = citasArr.length;

        // Actualizamos según el buscador activo
        switch (buscadorActual) {
            case "hoy":
                let citasHoyArr = buscador_hoy(citasArr);
                renderCitas(citasHoyArr);
                break;
            case "fecha":
                const fechaInput = document.querySelector("#input-date");

                let citasFechaArr = buscador_fecha(citasArr, fechaInput.value );
                renderCitas(citasFechaArr);
                break;
            case "todas":
                renderCitas(citasArr);
                break;
            default:
                break;
        }
    }
}


// Construimos un arreglo de objetos formateado para renderizarlo
let citasArr = [];
const citasAPI = async () => {
    try {
        const url = `${dominio}/api/vercitas`;
        const resultado = await fetch(url);
        const citas = await resultado.json();
        
        // Reiniciamos el arreglo en cada petición
        citasArr.length = 0;

        let citaObj = {};
        let servicioObj = {};

        idActual = 0;

        citas.forEach(cita => {
            
            const {id, hora, cliente, email, telefono, servicio, precio, fecha} = cita;

            if(idActual !== id){
                // TODO: Calcular total
                citaObj = {
                    id: id,
                    cliente: cliente,
                    telefono: telefono,
                    email: email,
                    hora: hora,
                    fecha: fecha,
                    servicios: [],
                    total: 0
                };
    
                citasArr.push(citaObj);

                idActual = id;
            }

            servicioObj = {
                servicio: servicio,
                precio: precio
            }

            citaObj.total += Number(precio);

            citaObj.servicios.push(servicioObj);

        });

    } catch (error) {
        console.log(error);
    }
}


// Scripting para construir las citas
const renderCitas = (citas) => {
    const divCitas = document.querySelector("#citas");
    divCitas.innerHTML = "";
    if(citas.length == 0){
        divCitas.innerHTML = "No hay Citas";
    }

    citas.forEach(cita => {
        const { id, cliente, telefono, email, fecha, hora, servicios, total } = cita;

        // Creamos contenedor cita
        const divCita = document.createElement("DIV");
        divCita.classList.add("cita");

        // Creamos contenedor cliente-info
        const divClienteInfo = document.createElement("DIV");
        divClienteInfo.classList.add("cliente-info");

        // Inyectamos id de la cita
        const citaId = document.createElement("P");
        citaId.innerHTML = `<span>Cita ID:</span> ${id}`;
        divClienteInfo.appendChild(citaId);

        // Inyectamos nombre de cliente a la cita
        const citaCliente = document.createElement("P");
        citaCliente.innerHTML = `<span>Cliente:</span> ${cliente}`;
        divClienteInfo.appendChild(citaCliente);

        divCita.appendChild(divClienteInfo);

        // Creamos contenedor cita-info
        const divCitaInfo = document.createElement("DIV");
        divCitaInfo.classList.add("cita-info");

        
        // Creamos contenedor contacto-info
        const divContactoInfo = document.createElement("DIV");
        divContactoInfo.classList.add("contacto-info");

        // Creamos el titulo
        const contactoTitulo = document.createElement("P");
        contactoTitulo.innerHTML = "<span>Contacto</span>";
        divContactoInfo.appendChild(contactoTitulo);

        // Inyectamos telefono a contacto-info
        const citaTelefono = document.createElement("P");
        citaTelefono.innerHTML = `<span>Teléfono:</span> ${telefono}`;
        divContactoInfo.appendChild(citaTelefono);

        // Inyectamos el email
        const citaEmail = document.createElement("P");
        citaEmail.innerHTML = `<span>Email:</span> ${email}`;
        divContactoInfo.appendChild(citaEmail);

        // Inyectamos la fecha
        const citaFecha = document.createElement("P");
        citaFecha.innerHTML = `<span>Fecha:</span> ${fecha}`;
        divContactoInfo.appendChild(citaFecha);

        // Inyectamos la cita
        const citaHora = document.createElement("P");
        citaHora.innerHTML = `<span>Hora:</span> ${hora}`;
        divContactoInfo.appendChild(citaHora);

        
        // Creamos contenedor para servicio-info
        const divServicioInfo = document.createElement("DIV");
        divServicioInfo.classList.add("servicio-info");

        // Creamos el titulo
        const serviciosTitulo = document.createElement("P");
        serviciosTitulo.innerHTML = "<span>Servicios</span>";
        divServicioInfo.appendChild(serviciosTitulo);

        servicios.forEach((servicioInfo) => {

            const { servicio, precio } = servicioInfo;

            const citaServicio = document.createElement("P");
            citaServicio.textContent = servicio;
            divServicioInfo.appendChild(citaServicio);

            const precioServicio = document.createElement("P");
            precioServicio.innerHTML = `<span>$${precio}</span>`;
            divServicioInfo.appendChild(precioServicio);

        });

        const precioTotal = document.createElement("P");
        precioTotal.innerHTML = `<span>Total:</span> $${total}`;
        divServicioInfo.appendChild(precioTotal);

        divCitaInfo.appendChild(divContactoInfo);
        divCitaInfo.appendChild(divServicioInfo);

        divCita.appendChild(divCitaInfo);

        const divEliminarCita = document.createElement("DIV");
        divEliminarCita.innerHTML = `<form action="/api/eliminar" method="POST">
        <input type="hidden" name="id" value="${id}">
        <input type="submit" value="Eliminar" class="boton-eliminar">
        </form>`

        divCita.appendChild(divEliminarCita);

        divCitas.appendChild(divCita);
    });

}