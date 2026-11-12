// Datos iniciales y estado
const STORAGE_KEY = "carrito";
const CODIGO_CUPON = "PROMO20";
const VALOR_DESCUENTO = 0.20;
const RUTA_DATA = "./db/data.json";

let productos = [];
let carrito = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let descuento = 0;

function sincronizarStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}

// DOM
const contenedorCatalogo = document.getElementById("contenedor-catalogo");
const contenedorCarrito = document.getElementById("contenedor-carrito");
const totalCarrito = document.getElementById("total-carrito");
const btnVaciar = document.getElementById("btn-vaciar");
const btnFinalizar = document.getElementById("btn-finalizar");
const inputBuscar = document.getElementById("input-buscar");
const seccionCheckout = document.getElementById("seccion-checkout");
const checkoutDetalle = document.getElementById("checkout-detalle");
const inputCupon = document.getElementById("input-cupon");
const btnCupon = document.getElementById("btn-cupon");
const checkoutCupon = document.querySelector(".checkout-cupon");
const checkoutForm = document.querySelector(".checkout-form");
const checkoutNombre = document.getElementById("checkout-nombre");
const checkoutEmail = document.getElementById("checkout-email");
const checkoutTelefono = document.getElementById("checkout-telefono");
const checkoutDireccion = document.getElementById("checkout-direccion");
const btnConfirmarCompra = document.getElementById("btn-confirmar-compra");
const resumenConfirmacion = document.getElementById("resumen-confirmacion");
const detalleCliente = document.getElementById("detalle-cliente");
const detalleProductos = document.getElementById("detalle-productos");
const detalleTotal = document.getElementById("detalle-total");

// Renderizado del catálogo y agregar al carrito
function renderizarProductos(lista) {
    contenedorCatalogo.innerHTML = "";

    if (lista.length === 0) {
        contenedorCatalogo.innerHTML = "<p>No hay productos para mostrar.</p>";
    } else {
        lista.forEach(producto => {
            const { id, nombre, precio, stock } = producto;
            const { sinImpuestos, total } = calcularImpuestos(precio);

            const enCarrito = carrito.find(prod => prod.id === id);
            const stockDisponible = enCarrito ? stock - enCarrito.cantidad : stock;

            const tarjeta = document.createElement("div");
            tarjeta.className = "producto-card";
            tarjeta.innerHTML = `  
                <div>
                    <h3>${nombre}</h3>
                    <p>Precio total: $${total}</p>
                    <p class="precio-secundario">Precio sin impuestos: $${sinImpuestos}</p>
                    <p>Stock disponible: ${stockDisponible}</p>
                </div>
                <button id="btn-agregar-${id}" class="btn btn-agregar" ${stockDisponible <= 0 ? "disabled" : ""}>
                    ${stockDisponible <= 0 ? "Sin stock" : "Agregar al carrito"}
                </button>
            `;
            contenedorCatalogo.appendChild(tarjeta);

            const boton = document.getElementById(`btn-agregar-${id}`);
            boton.addEventListener("click", () => {
                agregarAlCarrito(id);
            });
        });
    }
}

// Lógica del Carrito
function agregarAlCarrito(id) {
    const productoElegido = productos.find(prod => prod.id === id);
    const productoEnCarrito = carrito.find(prod => prod.id === id);

    if (productoElegido) {
        if (productoElegido.stock <= 0 || (productoEnCarrito && productoEnCarrito.cantidad >= productoElegido.stock)) {
            mostrarMensaje(`No hay más stock disponible de "${productoElegido.nombre}".`, true);
        } else {
            if (productoEnCarrito) {
                productoEnCarrito.cantidad++;
            } else {
                carrito.push({
                    id: productoElegido.id,
                    nombre: productoElegido.nombre,
                    precio: productoElegido.precio,
                    cantidad: 1
                });
            }

            resumenConfirmacion.classList.add("oculto");
            sincronizarStorage();
            mostrarCarrito();
            mostrarMensaje(`¡"${productoElegido.nombre}" agregado al carrito!`);
        }
    }
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(prod => prod.id === id);
    const productoOriginal = productos.find(prod => prod.id === id);

    if (item) {
        if (cambio > 0 && productoOriginal && item.cantidad >= productoOriginal.stock) {
            mostrarMensaje(`Alcanzaste el límite de stock de "${item.nombre}".`, true);
        } else {
            item.cantidad += cambio;

            if (item.cantidad <= 0) {
                eliminarDelCarrito(id);
            } else {
                sincronizarStorage();
                mostrarCarrito();
            }
        }
    }
}

function eliminarDelCarrito(id) {
    const indice = carrito.findIndex(prod => prod.id === id);

    if (indice !== -1) {
        const eliminado = carrito[indice];
        carrito.splice(indice, 1);

        if (carrito.length === 0) {
            descuento = 0;
            localStorage.removeItem(STORAGE_KEY);
            seccionCheckout.classList.add("oculto");
        } else {
            sincronizarStorage();
        }

        mostrarCarrito();
        mostrarMensaje(`Se eliminó "${eliminado.nombre}" del carrito.`, true);
    }
}

function vaciarCarrito() {
    if (carrito.length === 0) {
        mostrarMensaje("El carrito ya está vacío.", true);
    } else {
        carrito = [];
        descuento = 0;
        localStorage.removeItem(STORAGE_KEY);
        mostrarCarrito();
        seccionCheckout.classList.add("oculto");
        mostrarMensaje("Se vació todo el carrito.", true);
    }
}

function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje("El carrito está vacío, no hay nada para comprar.", true);
    } else {
        seccionCheckout.classList.remove("oculto");
        resumenConfirmacion.classList.add("oculto");
        checkoutDetalle.classList.remove("oculto");
        checkoutCupon.classList.remove("oculto");
        checkoutForm.classList.remove("oculto");

        renderizarCheckoutDetalle();
        mostrarMensaje("Por favor, completa tus datos para finalizar.");
    }
}

btnVaciar.addEventListener("click", vaciarCarrito);
btnFinalizar.addEventListener("click", finalizarCompra);

// Renderizado del Carrito y cálculo del Total
function mostrarCarrito() {
    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        totalCarrito.textContent = "0";
    } else {
        carrito.forEach(producto => {
            const subtotal = (producto.precio * producto.cantidad).toFixed(2);

            const fila = document.createElement("div");
            fila.className = "item-carrito";
            fila.innerHTML = `
            <p>${producto.nombre} - $${producto.precio.toFixed(2)} x ${producto.cantidad} = $${subtotal}</p>
                <div>
                    <button id="btn-restar-${producto.id}" class="btn">-</button>
                    <button id="btn-sumar-${producto.id}" class="btn">+</button>
                    <button id="btn-eliminar-${producto.id}" class="btn btn-eliminar">🗑️</button>
                </div>
            `;
            contenedorCarrito.appendChild(fila);

            document.getElementById(`btn-restar-${producto.id}`).addEventListener("click", () => {
                cambiarCantidad(producto.id, -1);
            });
            document.getElementById(`btn-sumar-${producto.id}`).addEventListener("click", () => {
                cambiarCantidad(producto.id, 1);
            });
            document.getElementById(`btn-eliminar-${producto.id}`).addEventListener("click", () => {
                eliminarDelCarrito(producto.id);
            });
        });

        const total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
        totalCarrito.textContent = total.toFixed(2);

        if (!seccionCheckout.classList.contains("oculto")) {
            renderizarCheckoutDetalle();
        }
    }

    const termino = inputBuscar.value.toLowerCase().trim();
    const filtrados = productos.filter(prod => prod.nombre.toLowerCase().includes(termino));
    renderizarProductos(filtrados);
}

function renderizarCheckoutDetalle() {
    const subtotal = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    const montoDescuento = subtotal * descuento;
    const totalFinal = subtotal - montoDescuento;

    checkoutDetalle.innerHTML = `
    Cantidad de productos: ${carrito.reduce((acc, p) => acc + p.cantidad, 0)}<br>
    Subtotal: $${subtotal.toFixed(2)}<br>
    ${descuento > 0 ? `Descuento aplicado (${descuento * 100}%): -$${montoDescuento.toFixed(2)}<br>` : ""}
    Total final a pagar: $${totalFinal.toFixed(2)}
    `;
}

function aplicarCupon() {
    const codigo = inputCupon.value.trim().toUpperCase();

    if (codigo === CODIGO_CUPON) {
        if (descuento > 0) {
            mostrarMensaje("El cupón ya fue aplicado.", true);
        } else {
            descuento = VALOR_DESCUENTO;
            renderizarCheckoutDetalle();
            mostrarMensaje(`¡Cupón del ${VALOR_DESCUENTO * 100}% aplicado con éxito!`);
        }
    } else {
        mostrarMensaje("Código de cupón inválido.", true);
    }
}

btnCupon.addEventListener("click", aplicarCupon);

// Buscador
inputBuscar.addEventListener("input", () => {
    const termino = inputBuscar.value.toLowerCase().trim();
    const filtrados = productos.filter(prod => prod.nombre.toLowerCase().includes(termino));
    renderizarProductos(filtrados);
});

// Asincronismo: fetch de productos y manejo de errores
async function pedirProductos() {
    const respuesta = await fetch(RUTA_DATA);

    if (!respuesta.ok) {
        throw new Error(`Error en la petición: status ${respuesta.status}`);
    }

    const productosDesdeJson = await respuesta.json();
    return productosDesdeJson;
}

async function cargarSimulador() {
    contenedorCatalogo.innerHTML = "<p>⏳ Cargando productos del catálogo...</p>";
    try {
        iniciarAvisoPromo(TEXTO_PROMO);
        const productosDesdeJson = await pedirProductos();
        productos = productosDesdeJson;
        mostrarMensaje(`✔️ Catálogo cargado con ${productos.length} productos.`);
        mostrarCarrito();
    } catch (error) {
        mostrarMensaje("⚠️ Error al cargar el catálogo de productos.", true);
        mostrarCarrito();
        contenedorCatalogo.innerHTML = "<p>⚠️ Ocurrió un error al cargar los productos. Por favor, intenta nuevamente más tarde.</p>";
    }
}
cargarSimulador();

function confirmarCompra() {
    const nombre = checkoutNombre.value.trim();
    const email = checkoutEmail.value.trim();
    const telefono = checkoutTelefono.value.trim();
    const direccion = checkoutDireccion.value.trim();

    const emailValido = email.includes("@") && email.includes(".");
    const datosValidos = nombre !== "" && emailValido && telefono !== "" && direccion !== "";

    if (!datosValidos) {
        mostrarMensaje("Por favor, completa todos tus datos correctamente.", true);
    } else if (carrito.length === 0) {
        mostrarMensaje("El carrito está vacío.", true);
    } else {
        const subtotal = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
        const montoDescuento = subtotal * descuento;
        const totalFinal = subtotal - montoDescuento;

        detalleCliente.innerHTML = ` 
        Nombre: ${nombre}<br>
        Email: ${email}<br>
        Teléfono: ${telefono}<br>
        Dirección: ${direccion}
    `;

        let htmlProductos = "Productos:<br>";

        carrito.forEach(prod => {
            htmlProductos += ` ${prod.nombre} x ${prod.cantidad} - $${(prod.precio * prod.cantidad).toFixed(2)}<br>`;

            const prodStock = productos.find(p => p.id === prod.id);
            if (prodStock) {
                prodStock.stock -= prod.cantidad;
            }
        });

        inputBuscar.value = "";

        detalleProductos.innerHTML = htmlProductos;
        detalleTotal.textContent = `Total a abonar: $${totalFinal.toFixed(2)}`;

        resumenConfirmacion.classList.remove("oculto");
        checkoutDetalle.classList.add("oculto");
        checkoutCupon.classList.add("oculto");
        checkoutForm.classList.add("oculto");

        carrito = [];
        descuento = 0;
        localStorage.removeItem(STORAGE_KEY);
        mostrarCarrito();
        inputCupon.value = "";
        checkoutNombre.value = "";
        checkoutEmail.value = "";
        checkoutTelefono.value = "";
        checkoutDireccion.value = "";
        mostrarMensaje("¡Compra confirmada con éxito!");
    }
}

btnConfirmarCompra.addEventListener("click", confirmarCompra);