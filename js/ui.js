// Cálculos auxiliares
const TASA_IMPUESTO = 0.20;

function calcularImpuestos(precio) {
    const sinImpuestos = (precio / (1 + TASA_IMPUESTO)).toFixed(2);
    const total = precio.toFixed(2);

    return {
        sinImpuestos,
        total
    };
}

// Feedback visual en pantalla
const CONFIG_TOAST = {
    duracion: 3000,
    posicion: "right",
    gravedad: "bottom",
    colorExito: "#15803d",
    colorError: "#b91c1c"
};

function mostrarMensaje(texto, esError = false) {
    Toastify({
        text: texto,
        duration: CONFIG_TOAST.duracion,
        gravity: CONFIG_TOAST.gravedad,
        position: CONFIG_TOAST.posicion,
        style: {
            background: esError ? CONFIG_TOAST.colorError : CONFIG_TOAST.colorExito
        }
    }).showToast();
}

// Banner promocional
const TEXTO_PROMO = "20% de descuento en todos los productos con el código PROMO20. ¡Aprovecha ahora!";

function iniciarAvisoPromo(mensaje = TEXTO_PROMO) {
    const avisoPromo = document.getElementById("aviso-promo");
    setTimeout(() => {
        avisoPromo.textContent = mensaje;
        avisoPromo.classList.remove("oculto");
    }, 1000);
}