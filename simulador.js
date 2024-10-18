// Información sobre tasas de interés y descuentos
const condicionesPago = [
    { tipo: "efectivo", descuento: 0.2 },
    { tipo: "debito", descuento: 0.1 },
    { tipo: "credito", descuento: 0 },
];

let cuotasDisponibles = [
    { cantidad: 3, tasa: 0.05 },
    { cantidad: 6, tasa: 0.1 },
    { cantidad: 12, tasa: 0.15 },
];

// Función para calcular el monto con el descuento aplicado
function aplicarDescuento(monto, formaPago) {
    const condicion = condicionesPago.find((cond) => cond.tipo === formaPago);
    return condicion ? monto * (1 - condicion.descuento) : monto;
}

// Función para calcular las cuotas con interés
function calcularCuotas(monto, cuotas) {
    const plan = cuotasDisponibles.find((cuota) => cuota.cantidad === cuotas);
    if (plan) {
        const montoFinal = monto * (1 + plan.tasa);
        return montoFinal / cuotas;
    }
    return 0;
}

// Función para actualizar el DOM con los resultados
function mostrarResultado(montoFinal, valorCuota) {
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `
    <p>Monto total a pagar: $${montoFinal.toFixed(2)}</p>
    <p>Valor de cada cuota: $${valorCuota.toFixed(2)}</p>
    `;
}

// Función para guardar el historial de montos en localStorage
function guardarHistorial(montoFinal) {
    let historial = JSON.parse(localStorage.getItem("historial")) || [];
    historial.push({ fecha: new Date().toLocaleString(), monto: montoFinal.toFixed(2) });
    localStorage.setItem("historial", JSON.stringify(historial));
    mostrarHistorial();
}

// Función para mostrar el historial en el DOM
function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem("historial")) || [];
    const historialDiv = document.getElementById("historial");
    historialDiv.innerHTML = historial.map(
        (registro) => `<p>${registro.fecha}: $${registro.monto}</p>`
    ).join("");
}

// Evento para capturar la información del usuario y realizar el cálculo
document.getElementById("calcularBtn").addEventListener("click", () => {
    const monto = parseFloat(document.getElementById("monto").value);
    const cuotas = parseInt(document.getElementById("cuotas").value);
    const formaPago = document.getElementById("formaPago").value;

    if (isNaN(monto) || isNaN(cuotas) || !formaPago) {
        Swal.fire({
            title: "Error",
            text: "Por favor, ingresa todos los valores correctamente.",
            icon: "error",
        });
        return;
    }

    const montoConDescuento = aplicarDescuento(monto, formaPago);
    const valorCuota = calcularCuotas(montoConDescuento, cuotas);

    mostrarResultado(montoConDescuento, valorCuota);
    mostrarMensajeExito();

    // Guardar los datos en localStorage y el historial
    localStorage.setItem("monto", monto);
    localStorage.setItem("cuotas", cuotas);
    localStorage.setItem("formaPago", formaPago);
    guardarHistorial(montoConDescuento);
});

// Ejemplo de uso de SweetAlert
function mostrarMensajeExito() {
    Swal.fire({
        title: "¡Cálculo realizado!",
        text: "Revisa los detalles de tus cuotas.",
        icon: "success",
    });
}

// Cargar cuotas desde un JSON local utilizando fetch
function cargarCuotas() {
    fetch("cuotas.json")
    .then((response) => {
        if (!response.ok) throw new Error("Error al cargar el archivo JSON");
        return response.json();
    })
    .then((data) => {
        cuotasDisponibles = data;
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

// Recuperar los datos almacenados en localStorage y mostrarlos en los campos
function recuperarDatos() {
    const monto = localStorage.getItem("monto");
    const cuotas = localStorage.getItem("cuotas");
    const formaPago = localStorage.getItem("formaPago");

    if (monto) document.getElementById("monto").value = monto;
    if (cuotas) document.getElementById("cuotas").value = cuotas;
    if (formaPago) document.getElementById("formaPago").value = formaPago;
}

// Llamar a las funciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarCuotas();
    recuperarDatos();
    mostrarHistorial();
});
