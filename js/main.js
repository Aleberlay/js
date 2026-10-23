// 1. Base de datos
const carrito = [
  { id: 1, nombre: "Auriculares Redragon", precio: 45000, stock: 10 },
  { id: 2, nombre: "Teclado Noga", precio: 60000, stock: 5 },
  { id: 3, nombre: "Mouse GX", precio: 30000, stock: 15 },
  { id: 4, nombre: "Monitor 24 Pulgadas", precio: 120000, stock: 8 },
  { id: 5, nombre: "Monitor 27 Pulgadas", precio: 200000, stock: 3 }
];

function calcularImpuestos(precio) {
  return {
    sinImpuestos: precio * 0.8,
    impuesto: precio * 0.2,
    total: precio
  };
}

function existeId(idBuscado) {
  return carrito.some(prod => prod.id === idBuscado);
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

// 3. Feedback visual en pantalla
function mostrarMensaje(texto, esError = false) {
  if (!contenedorMensaje) return;
  contenedorMensaje.textContent = texto;
  contenedorMensaje.className = esError ? "mensaje error" : "mensaje exito";
}

// 4. Carrito
function mostrarCarrito(listaProductos) {
  contenedor.innerHTML = "";

  if (listaProductos.length === 0) {
    contenedor.innerHTML = "<p>No hay productos para mostrar.</p>";
    return;
  }

  listaProductos.forEach(producto => {
    const precios = calcularImpuestos(producto.precio);
    const tarjeta = document.createElement("div");
    tarjeta.className = "producto-card";

    tarjeta.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p>ID: ${producto.id}</p>
      <p>Precio sin impuestos: $${precios.sinImpuestos}</p>
      <p>Precio total: $${producto.precio}</p>
      <p>Stock: ${producto.stock}</p>
      <button class="btn btn-eliminar" data-id="${producto.id}">Eliminar</button>
    `;

    contenedor.appendChild(tarjeta);
  });

  const botonesEliminar = document.querySelectorAll(".btn-eliminar");
  botonesEliminar.forEach(boton => {
    boton.addEventListener("click", (event) => {
      const idAEliminar = parseInt(event.target.getAttribute("data-id"));
      const indice = carrito.findIndex(prod => prod.id === idAEliminar);
      if (indice !== -1) {
        const eliminado = carrito.splice(indice, 1)[0];
        mostrarCarrito(carrito);
        mostrarMensaje(`Se eliminó "${eliminado.nombre}" correctamente.`);
      }
    });
  });
}

function agregarProductoFinal() {
  const id = parseInt(inputId.value);
  const nombre = inputNombre.value.trim();
  const precio = parseFloat(inputPrecio.value);
  const stock = parseInt(inputStock.value);

  if (isNaN(id) || id <= 0) {
    mostrarMensaje("Ingresá un ID numérico válido.", true);
    return;
  }
  if (existeId(id)) {
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

  const nuevoProducto = { id: id, nombre: nombre, precio: precio, stock: stock };
  carrito.push(nuevoProducto);

  inputId.value = "";
  inputNombre.value = "";
  inputPrecio.value = "";
  inputStock.value = "";

  mostrarCarrito(carrito);
  mostrarMensaje(`¡"${nuevoProducto.nombre}" agregado con éxito!`);
}

btnAgregar.addEventListener("click", agregarProductoFinal);

inputBuscar.addEventListener("input", () => {
  const termino = inputBuscar.value.toLowerCase().trim();
  const filtrados = carrito.filter(prod =>
    prod.nombre.toLowerCase().includes(termino) || prod.id.toString() === termino
  );
  mostrarCarrito(filtrados);
});

mostrarCarrito(carrito);
