// 1. Datos iniciales y estado
let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function calcularImpuestos(precio) {
    return {
        sinImpuestos: (precio * 0.8).toFixed(2),
        impuesto: (precio * 0.2).toFixed(2),
        total: precio.toFixed(2)
    };
}

// 2. DOM
const contenedorCatalogo = document.getElementById("contenedor-catalogo");
const contenedorCarrito = document.getElementById("contenedor-carrito");
const totalCarrito = document.getElementById("total-carrito");
const btnVaciar = document.getElementById("btn-vaciar");
const inputBuscar = document.getElementById("input-buscar");
const avisoPromo = document.getElementById("aviso-promo");
const btnFinalizar = document.getElementById("btn-finalizar");

// 3. Feedback visual en pantalla
function mostrarMensaje(texto, esError = false) {
    if (typeof Toastify === "function") {
        Toastify({
            text: texto,
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
                background: esError ? "#b91c1c" : "#15803d"
            }
        }).showToast();
    } else {
        console.log(`[Mensaje]: ${texto}`);
    }
}

// 4. Renderizado del catálogo y agregar al carrito
function renderizarProductos(lista) {
    if (!contenedorCatalogo) return;
    contenedorCatalogo.innerHTML = "";

    if (lista.length === 0) {
        contenedorCatalogo.innerHTML = "<p>No hay productos para mostrar.</p>";
        return;
    }

    lista.forEach(producto => {
        const { id, nombre, precio } = producto;
        const { sinImpuestos, total } = calcularImpuestos(precio);

        const tarjeta = document.createElement("div");
        tarjeta.className = "producto-card";
        tarjeta.innerHTML = `
            ${nombre}<br>
            Precio sin impuestos: $${sinImpuestos}<br>
            Precio total: $${total}<br>
            <button id="btn-agregar-${id}" class="btn">Agregar al carrito</button>
        `;
        contenedorCatalogo.appendChild(tarjeta);

        const boton = document.getElementById(`btn-agregar-${id}`);
        if (boton) {
            boton.addEventListener("click", () => {
                agregarAlCarrito(id);
            });
        }
    });
}

// 5. Lógica del Carrito
function agregarAlCarrito(id) {
    const productoElegido = productos.find(prod => prod.id === id);
    const productoEnCarrito = carrito.find(prod => prod.id === id);

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

    sincronizarStorage();
    mostrarCarrito();
    mostrarMensaje(`¡"${productoElegido.nombre}" agregado al carrito!`);
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(prod => prod.id === id);

    if (item) {
        item.cantidad += cambio;

        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            sincronizarStorage();
            mostrarCarrito();
        }
    }
}

function eliminarDelCarrito(id) {
    const indice = carrito.findIndex(prod => prod.id === id);

    if (indice !== -1) {
        const [eliminado] = carrito.splice(indice, 1);
        sincronizarStorage();
        mostrarCarrito();
        mostrarMensaje(`Se eliminó "${eliminado.nombre}" del carrito.`, true);
    }
}

function vaciarCarrito() {
    if (carrito.length === 0) {
        mostrarMensaje("El carrito ya está vacío.", true);
        return;
    }

    carrito = [];
    sincronizarStorage();
    mostrarCarrito();
    mostrarMensaje("Se vació todo el carrito.", true);
}

if (btnVaciar) {
    btnVaciar.addEventListener("click", vaciarCarrito);
}

function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje("El carrito está vacío, no hay nada para comprar.", true);
        return;
    }

    mostrarMensaje("¡Gracias por tu compra! Tu pedido fue procesado.");

    carrito = [];
    sincronizarStorage();
    mostrarCarrito();
}

if (btnFinalizar) {
    btnFinalizar.addEventListener("click", finalizarCompra);
}

// 6. Renderizado del Carrito y cálculo del Total
function mostrarCarrito() {
    if (!contenedorCarrito) return;
    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        if (totalCarrito) totalCarrito.textContent = "0";
        return;
    }

    carrito.forEach(producto => {
        const subtotal = (producto.precio * producto.cantidad).toFixed(2);

        const fila = document.createElement("div");
        fila.className = "item-carrito";
        fila.innerHTML = `
            ${producto.nombre} - $${producto.precio} x ${producto.cantidad} = $${subtotal}
            <button id="btn-restar-${producto.id}">-</button>
            <button id="btn-sumar-${producto.id}">+</button>
            <button id="btn-eliminar-${producto.id}">🗑️</button>
        `;
        contenedorCarrito.appendChild(fila);

        const btnRestar = document.getElementById(`btn-restar-${producto.id}`);
        const btnSumar = document.getElementById(`btn-sumar-${producto.id}`);
        const btnEliminar = document.getElementById(`btn-eliminar-${producto.id}`);

        if (btnRestar) {
            btnRestar.addEventListener("click", () => {
                cambiarCantidad(producto.id, -1);
            });
        }

        if (btnSumar) {
            btnSumar.addEventListener("click", () => {
                cambiarCantidad(producto.id, 1);
            });
        }

        if (btnEliminar) {
            btnEliminar.addEventListener("click", () => {
                eliminarDelCarrito(producto.id);
            });
        }
    });

    const total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    if (totalCarrito) totalCarrito.textContent = total.toFixed(2);
}

// 7. Buscador
if (inputBuscar) {
    inputBuscar.addEventListener("input", () => {
        const termino = inputBuscar.value.toLowerCase().trim();
        const filtrados = productos.filter(prod =>
            prod.nombre.toLowerCase().includes(termino)
        );
        renderizarProductos(filtrados);
    });
}

// 8. Asincronismo: fetch de productos y manejo de errores
async function pedirProductos() {
    const respuesta = await fetch("./db/data.json");

    if (!respuesta.ok) {
        throw new Error(`Error en la petición: status ${respuesta.status}`);
    }

    const productosDesdeJson = await respuesta.json();
    return productosDesdeJson;
}

function iniciarAvisoPromo() {
    setTimeout(() => {
        if (avisoPromo) {
            avisoPromo.textContent = "20% de descuento en todos los productos con el código PROMO20. ¡Aprovechá ahora!";
            avisoPromo.style.display = "block";
        }
    }, 1000);
}

async function cargarSimulador() {
    if (contenedorCatalogo) {
        contenedorCatalogo.innerHTML = "<p>⏳ Cargando productos del catálogo...</p>";
    }

    mostrarMensaje("⏳ Cargando catálogo...");

    try {
        iniciarAvisoPromo();
        const productosDesdeJson = await pedirProductos();
        productos = productosDesdeJson;
        renderizarProductos(productos);
        mostrarCarrito();
        mostrarMensaje(`✔️ Catálogo cargado con ${productos.length} productos.`);
    } catch (error) {
        mostrarMensaje(`⚠️ ${error.message}`, true);
        console.error("Detalle del error de fetch:", error);

        if (contenedorCatalogo) {
            contenedorCatalogo.innerHTML = "<p>⚠️ Ocurrió un error al cargar los productos. Por favor, intentá nuevamente más tarde.</p>";
        }
    } finally {
        console.log("Proceso de carga completado");
    }
}
cargarSimulador();