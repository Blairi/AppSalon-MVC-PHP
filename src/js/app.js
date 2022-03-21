let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3; // 500 resultados, mostrar 20 = 500 /20
const dominio = "https://morning-taiga-80295.herokuapp.com"

const cita = {
    id: "",
    nombre: "",
    fecha: "",
    hora: "",
    servicios: []
}

document.addEventListener("DOMContentLoaded", () => {
    iniciarApp();
});


const iniciarApp = () => {
    mostrarSeccion(); // Muestra y ocula secciones
    tabs(); // Cambia la sección cuando se presionan los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta API backend PHP

    idCliente();

    nombreCliente(); // Añade el nombre del cliente al objeto de cita

    seleccionarFecha(); // Añade la fecha de la cita en el objeto

    seleccionarHora(); // Añade la hora en el objeto

    mostrarResumen();
}


const mostrarSeccion = () => {

    // Ocultar la sección que tenga la clase mostrar
    const seccionAnterior = document.querySelector(".mostrar");
    if(seccionAnterior){
        seccionAnterior.classList.remove("mostrar");
    }

    // Seleccionar la sección con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add("mostrar");

    // Quita la clase actual al tab anterior
    const tabAnterior = document.querySelector(".actual");
    if(tabAnterior){
        tabAnterior.classList.remove("actual");
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add("actual");
}


const tabs = () => {
    const botones = document.querySelectorAll(".tabs button");
    
    botones.forEach( (boton) => {
        boton.addEventListener("click", (e) => {
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();

            mostrarResumen();
        });
    });
}


const botonesPaginador = () => {
    const paginaAnterior = document.querySelector("#anterior");
    const paginaSiguiente = document.querySelector("#siguiente");

    if(paso === 1){
        paginaAnterior.classList.add("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }
    else if(paso === 3){
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.add("ocultar");

        mostrarResumen();
    }
    else{
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }

    mostrarSeccion();

}


const paginaAnterior = () => {
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener("click", () => {
        if(paso <= pasoInicial) return;
        
        paso--;
        
        botonesPaginador();

    });
}


const paginaSiguiente = () => {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click", () => {
        if(paso >= pasoFinal) return;

        paso++;
        
        botonesPaginador();

    });
}


const consultarAPI = async () => {
    try {
        const url = `${dominio}/api/servicios`;
        const resultado = await fetch(url);
        const servicios = await resultado.json();

        mostrarServicios(servicios);


    } catch (error) {
        console.log(error);
    }
}


const mostrarServicios = (servicios) => {
    servicios.forEach(servicio => {
        const {id, nombre, precio} = servicio;
        
        const nombreServicio = document.createElement("P");
        nombreServicio.classList.add("nombre-servicio");
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement("P");
        precioServicio.classList.add("precio-servicio");
        precioServicio.textContent = `$${precio}`;

        const servicioDIV = document.createElement("DIV");
        servicioDIV.classList.add("servicio");
        servicioDIV.dataset.idServicio = id;
        servicioDIV.onclick = () => {
            seleccionarServicio(servicio);
        };

        servicioDIV.appendChild(nombreServicio);
        servicioDIV.appendChild(precioServicio);
        
        document.querySelector("#servicios").appendChild(servicioDIV);

    });
}


const seleccionarServicio = (servicio) => {
    const { id } = servicio;
    const {servicios} = cita;

    // Identificar elemento
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si un servicio ya fue agregado
    if( servicios.some( agregado => agregado.id === id ) ){
        // Eliminarlo
        cita.servicios = servicios.filter( agregado => agregado.id !== id );
        divServicio.classList.remove("seleccionado");
    }
    else{
        // Agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add("seleccionado");
    }
}


const idCliente = () => {
    cita.id = document.querySelector("#id").value;
}


const nombreCliente = () => {
    cita.nombre = document.querySelector("#nombre").value;
}


const seleccionarFecha = () => {
    const inputFecha = document.querySelector("#fecha");
    inputFecha.addEventListener("input", (e) => {
        
        const dia = new Date(e.target.value).getUTCDay();

        if( [6, 0].includes(dia) ){
            e.target.value = "";
            mostrarAlerta("Fines de semana no permitidos", "error", ".formulario");
        }
        else{
            cita.fecha = e.target.value;
        }
        
    });
}


const seleccionarHora = () => {
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener("input", (e) => {
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        
        if(hora < 10 || hora > 18){
            e.target.value = "";
            mostrarAlerta("Hora No Válida", "error", ".formulario");
        }
        else{
            cita.hora = e.target.value;
        }

    });
}


const mostrarResumen = () => {
    const resumen = document.querySelector(".contenido-resumen");

    // Limpiar contenido de resumen
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes("") || cita.servicios.length === 0){
        mostrarAlerta("Faltan datos de Servicios, Fecha u Hora", "error", ".contenido-resumen", false);
        return;
    }
    
    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading para Servicios en Resumen
    const headingServicios = document.createElement("H3");
    headingServicios.textContent = "Resumen de Servicios";
    resumen.appendChild(headingServicios);

    // Mostrando servicios
    servicios.forEach( (servicio) => {

        const { id, precio, nombre } = servicio;

        const contenedorServicio = document.createElement("DIV");
        contenedorServicio.classList.add("contenedor-servicio");

        const textoServicio = document.createElement("P");
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement("P");
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    // Heading para Servicios en Resumen
    const headingCita = document.createElement("H3");
    headingCita.textContent = "Resumen de Cita";
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement("P");
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));

    const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    const fechaFormateada = fechaUTC.toLocaleDateString("es-MX", opciones);

    const fechaCita = document.createElement("P");
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement("P");
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    // Boton para crear la cita
    const botonReservar = document.createElement("BUTTON");
    botonReservar.classList.add("boton");
    botonReservar.textContent = "Reservar cita";
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);

}


const reservarCita = async () => {

    const {id, fecha, hora, servicios} = cita;

    const idServicios = servicios.map( servicio => servicio.id );

    const datos = new FormData();

    datos.append("fecha", fecha);
    datos.append("hora", hora);
    datos.append("usuarioId", id);
    datos.append("servicios", idServicios);

    // Petición hacia la API
    try {
        const url = `${dominio}/api/citas`;
        const respuesta = await fetch(url, {
            method: "POST",
            body: datos
        });
    
        const resultado = await respuesta.json();
    
        if(resultado.resultado){
            Swal.fire({
                icon: 'success',
                title: 'Cita Creada',
                text: 'Tu cita fue creada correctamente',
                button: 'OK'
            }).then( () => {
                setTimeout(() => {
                    // TODO: limpiar objeto para no recargar
                    window.location.reload();
                }, 3000);
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita'
        });
    }

    // console.log([...datos]);
}


const mostrarAlerta = (mensaje, tipo, elemento, desaparece = true) => {

    // Previene que se generen más de una alerta
    const alertaPrevia = document.querySelector(".alerta");
    if(alertaPrevia){
        alertaPrevia.remove();
    }

    // Generar alerta
    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    // Eliminar la alerta
    if(desaparece){
        setTimeout(()=> {
            alerta.remove();
        }, 3000);
    }

}

