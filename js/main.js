// 1. Datos iniciales y estado
let productos = [];
let carrito = [];

function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarStorageCarrito() {
    try {
        const itemGuardado = localStorage.getItem("carrito");
        if (itemGuardado) {
            const datosGuardados = JSON.parse(itemGuardado);
            if (Array.isArray(datosGuardados)) {
                carrito = datosGuardados;
            }
        }
    } catch (error) {
        console.error("Error al leer el carrito de localStorage:", error);
        carrito = [];
    }
}

function calcularImpuestos(precio) {
    return {
        sinImpuestos: (precio * 0.8).toFixed(2),
        impuesto: (precio * 0.2).toFixed(2),
        total: precio.toFixed(2)
    };
}

// 2. DOM
const contenedor = document.getElementById("contenedor");
const inputId = document.getElementById("input-id");
const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const inputStock = document.getElementById("input-stock");
const btnAgregar = document.getElementById("btn-agregar");
const inputBuscar = document.getElementById("input-buscar");
const contenedorMensaje = document.getElementById("mensaje");
const avisoPromo = document.getElementById("aviso-promo");

// 3. Feedback visual en pantalla
function mostrarMensaje(texto, esError = false) {
    if (contenedorMensaje) {
        contenedorMensaje.textContent = texto;
        contenedorMensaje.className = esError ? "mensaje error" : "mensaje exito";
    }

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
    }
}

// 4. Renderizado del catálogo y agregar al carrito
function renderizarProductos(lista) {
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No hay productos para mostrar.</p>";
        return;
    }

    lista.forEach(producto => {
        const { id, nombre, precio, stock } = producto;
        const { sinImpuestos, total } = calcularImpuestos(precio);

        const tarjeta = document.createElement("div");
        tarjeta.className = "producto-card";
        tarjeta.innerHTML = `
      <h3>${nombre}</h3>
      <p>ID: ${id}</p>
      <p>Precio sin impuestos: $${sinImpuestos}</p>
      <p>Precio total: $${total}</p>
      <p>Stock: ${stock}</p>
      <button class="btn-agregar-carrito" data-id="${id}">Agregar al carrito</button>
    `;

        contenedor.appendChild(tarjeta);
    });

    const botonesAgregar = document.querySelectorAll(".btn-agregar-carrito");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", (event) => {
            const idSeleccionado = parseInt(event.target.getAttribute("data-id"));
            const productoElegido = productos.find(prod => prod.id === idSeleccionado);

            if (productoElegido) {
                carrito.push(productoElegido);
                sincronizarStorage();
                mostrarMensaje(`¡"${productoElegido.nombre}" agregado al carrito!`);
            }
        });
    });
}

// 5. Agregar producto
function agregarProductoFinal() {
    const id = parseInt(inputId.value);
    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value);
    const stock = parseInt(inputStock.value);

    if (isNaN(id) || id <= 0) {
        mostrarMensaje("Ingresá un ID numérico válido.", true);
        return;
    }
    if (productos.some(prod => prod.id === id)) {
        mostrarMensaje(`Ya existe un producto con el ID ${id}.`, true);
        return;
    }
    if (!nombre) {
        mostrarMensaje("Ingresá un nombre válido.", true);
        return;
    }
    if (isNaN(precio) || precio <= 0) {
        mostrarMensaje("Ingresá un precio mayor a 0.", true);
        return;
    }
    if (isNaN(stock) || stock < 0) {
        mostrarMensaje("Ingresá un stock válido.", true);
        return;
    }

    const nuevoProducto = { id, nombre, precio, stock };
    productos.push(nuevoProducto);

    inputId.value = "";
    inputNombre.value = "";
    inputPrecio.value = "";
    inputStock.value = "";

    renderizarProductos(productos);
    mostrarMensaje(`¡"${nuevoProducto.nombre}" agregado al catálogo!`);
}

if (btnAgregar) {
    btnAgregar.addEventListener("click", agregarProductoFinal);
}

if (inputBuscar) {
    inputBuscar.addEventListener("input", () => {
        const termino = inputBuscar.value.toLowerCase().trim();
        const filtrados = productos.filter(prod =>
            prod.nombre.toLowerCase().includes(termino) || prod.id.toString() === termino
        );
        renderizarProductos(filtrados);
    });
}

// 6. Asincronismo: fetch
async function pedirProductos() {
    const respuesta = await fetch("./db.json");
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
    mostrarMensaje("⏳ Cargando catálogo...");
    try {
        cargarStorageCarrito();
        iniciarAvisoPromo();

        const productosDesdeJson = await pedirProductos();
        productos = productosDesdeJson;

        renderizarProductos(productos);

        mostrarMensaje(`✔️ Catálogo cargado con ${productos.length} productos.`);
    } catch (error) {
        mostrarMensaje(`⚠️ ${error.message}`, true);
        console.error("Detalle del error de fetch:", error);
    } finally {
        console.log("Proceso de carga completado");
    }
}

cargarSimulador();
