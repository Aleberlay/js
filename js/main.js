// 1. Clase Producto
class Producto {
  constructor(id, nombre, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  verImpuestos() {
    return {
      sinImpuestos: this.precio * 0.8,
      impuesto: this.precio * 0.2,
      total: this.precio
    };
  }
}

// 2. Array de productos iniciales en el carrito
const carrito = [
  new Producto(1, "Auriculares Redragon", 45000, 10),
  new Producto(2, "Teclado Noga", 60000, 5),
  new Producto(3, "Mouse GX", 30000, 15),
  new Producto(4, "Monitor 24 Pulgadas", 120000, 8),
  new Producto(5, "Monitor 27 Pulgadas", 200000, 3)
];

function existeId(idBuscado) {
  for (const prod of carrito) {
    if (prod.id === idBuscado) {
      return true;
    }
  }
  return false;
}

function buscarProductoPorNombreOId(termino) {
  for (let i = 0; i < carrito.length; i++) {
    const prod = carrito[i];
    if (prod.nombre.toLowerCase() === termino.toLowerCase() || prod.id.toString() === termino) {
      return { producto: prod, posicion: i };
    }
  }
  return null;
}

// 3. Funciones del carrito 
function mostrarCarrito(listaProductos) {
  if (listaProductos.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  console.log("--- ARTÍCULOS EN EL CARRITO ---");
  for (const producto of listaProductos) {
    const precios = producto.verImpuestos();
    console.log(
      "ID: " + producto.id +
      " | Producto: " + producto.nombre +
      " | Precio sin impuestos: $" + precios.sinImpuestos +
      " | Precio total: $" + producto.precio +
      " | Stock: " + producto.stock
    );
  }
  alert("Visualizá la consola (F12) para ver los productos.");
}

function pedirDatosProducto() {
  const nombre = prompt("Ingresá el nombre del producto:");
  if (!nombre) {
    alert("Nombre no válido.");
    return null;
  }

  const precio = parseFloat(prompt("Ingresá el precio del producto:"));
  if (isNaN(precio) || precio <= 0) {
    alert("Precio no válido.");
    return null;
  }

  const stock = parseInt(prompt("Ingresá el stock disponible:"));
  if (isNaN(stock) || stock < 0) {
    alert("Stock no válido.");
    return null;
  }

  return { nombre: nombre, precio: precio, stock: stock };
}

function agregarProductoFinal() {
  const id = parseInt(prompt("Ingresá el ID del producto:"));
  if (isNaN(id) || id <= 0) {
    alert("ID no válido.");
    return;
  }

  if (existeId(id)) {
    alert("Error: Ya existe un producto con el ID " + id + ".");
    return;
  }

  const datos = pedirDatosProducto();
  if (datos !== null) {
    const nuevoProducto = new Producto(id, datos.nombre, datos.precio, datos.stock);
    carrito.push(nuevoProducto);
    alert("Se agregó '" + nuevoProducto.nombre + "' al final del carrito.");
  }
}

function agregarProductoInicio() {
  const id = parseInt(prompt("Ingresá el ID del producto prioritario:"));
  if (isNaN(id) || id <= 0) {
    alert("ID no válido.");
    return;
  }

  if (existeId(id)) {
    alert("Error: Ya existe un producto con el ID " + id + ".");
    return;
  }

  const datos = pedirDatosProducto();
  if (datos !== null) {
    const nuevoProducto = new Producto(id, datos.nombre, datos.precio, datos.stock);
    carrito.unshift(nuevoProducto);
    alert("Se agregó '" + nuevoProducto.nombre + "' al inicio de la lista.");
  }
}

function quitarUltimoProducto() {
  if (carrito.length === 0) {
    alert("El carrito ya está vacío, no hay productos para eliminar.");
    return;
  }

  const eliminado = carrito.pop();
  alert("Se ha eliminado el elemento: " + eliminado.nombre);
}

function reemplazarProductoPorIndice() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const indiceTexto = prompt("Ingresá la posición (0 a " + (carrito.length - 1) + ") del producto a cambiar:");
  if (indiceTexto === null || indiceTexto === "") return;

  const indice = parseInt(indiceTexto);
  if (isNaN(indice) || indice < 0 || indice >= carrito.length) {
    alert("Posición no válida.");
    return;
  }

  const id = parseInt(prompt("Ingresá el ID del nuevo producto:"));
  if (isNaN(id) || id <= 0) {
    alert("ID no válido.");
    return;
  }

  if (id !== carrito[indice].id && existeId(id)) {
    alert("Error: Ya existe otro producto con el ID " + id + ".");
    return;
  }

  const datos = pedirDatosProducto();
  if (datos !== null) {
    const reemplazo = new Producto(id, datos.nombre, datos.precio, datos.stock);
    const anterior = carrito.splice(indice, 1, reemplazo);
    alert("Se reemplazó '" + anterior[0].nombre + "' por '" + reemplazo.nombre + "'.");
  }
}

function buscarProductoYConsultarPrecio() {
  const busqueda = prompt("Ingresá el nombre exacto o ID del producto a buscar:");
  if (!busqueda) {
    alert("No ingresaste ningún término de búsqueda.");
    return;
  }

  const resultado = buscarProductoPorNombreOId(busqueda);
  if (resultado !== null) {
    const prod = resultado.producto;
    const precios = prod.verImpuestos();
    alert(
      "El producto '[ID: " + prod.id + "] " + prod.nombre + "' está en el carrito (posición " + resultado.posicion + ")\n" +
      "Precio sin impuestos: $" + precios.sinImpuestos + "\n" +
      "Precio final con impuestos: $" + precios.total + "\n" +
      "Stock disponible: " + prod.stock + " unidades"
    );
  } else {
    alert("El producto '" + busqueda + "' no está en el carrito.");
  }
}

// 4. Funcioón principal
function simuladorCarrito() {
  let opcion = "";

  while (opcion !== "7" && opcion !== null) {
    opcion = prompt(
      "--- MENÚ DEL CARRITO DE COMPRAS ---\n" +
      "1. Ver artículos en el carrito\n" +
      "2. Agregar producto al final\n" +
      "3. Agregar producto prioritario al inicio\n" +
      "4. Quitar el último producto agregado\n" +
      "5. Reemplazar un producto de la lista\n" +
      "6. Buscar producto y consultar precio\n" +
      "7. Salir\n\n" +
      "Ingresá el número de la opción que deseas realizar:"
    );

    switch (opcion) {
      case "1":
        mostrarCarrito(carrito);
        break;
      case "2":
        agregarProductoFinal();
        break;
      case "3":
        agregarProductoInicio();
        break;
      case "4":
        quitarUltimoProducto();
        break;
      case "5":
        reemplazarProductoPorIndice();
        break;
      case "6":
        buscarProductoYConsultarPrecio();
        break;
      case "7":
      case null:
        alert("¡Gracias por visitar la tienda!");
        break;
      default:
        alert("Opción no válida. Por favor, seleccioná un número del 1 al 7.");
        break;
    }
  }
}

simuladorCarrito();
