// const dominio = "https://morning-taiga-80295.herokuapp.com"
const dominio = "http://localhost";
document.addEventListener("DOMContentLoaded", () => {
    iniciarApp();
});


const iniciarApp = () => {
    citasAPI();
    buscador();
}


const citasArr = [];
const citasAPI = async () => {
    try {

        const url = `${dominio}/api/vercitas`;
        const resultado = await fetch(url);
        const citas = await resultado.json();

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

        // Al iniciar la app se cargan las citas de hoy
        const citasHoyArr = citasHoy();
        renderCitas(citasHoyArr);

    } catch (error) {
        console.log(error);
    }
}

const buscador = () => {

    const titulo = document.querySelector("#titulo-buscador");

    const buscador = document.querySelector("#buscador");

    buscador.addEventListener("input", (e) => {

        const divInputs = document.querySelector(".inputs");
        divInputs.innerHTML = "";

        if(e.target.value == "hoy"){
            titulo.textContent = "Citas de Hoy";
            const citasHoyArr = citasHoy();
            if(citasHoyArr){
                renderCitas(citasHoyArr);
            }
        }
        if(e.target.value == "fecha"){
            titulo.textContent = "Citas por fecha";
            
            const divInputs = document.querySelector(".inputs");
            divInputs.innerHTML = `<input type="date" id="input-fecha">`;
            
            const inputFecha = document.querySelector("#input-fecha");

            inputFecha.addEventListener("input", (e) => {
                const citasFechaArr = buscarFecha(e.target.value);
                renderCitas(citasFechaArr);
            });

        }

        if(e.target.value == "todas"){
            titulo.textContent = "Todas las citas";
            renderCitas(citasArr);
        }

    });
}


// const hoy = new Date();
// const fecha = hoy.getFullYear()  + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getDate();
const fecha = "2022-03-22";
const citasHoy = () => {
    const citasHoyArr = citasArr.filter(cita => cita.fecha == fecha);
    return citasHoyArr;
}


const buscarFecha = (fecha) => {
    const citasFechaArr = citasArr.filter(cita => cita.fecha == fecha);
    return citasFechaArr;
}


const renderCitas = (citas) => {
    const divCitas = document.querySelector("#citas");
    divCitas.innerHTML = "";

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