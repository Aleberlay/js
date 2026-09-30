// 1. Clase Producto
class Producto {
  constructor(id, nombre, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  verImpuestos() {
    const precios = {
      sinImpuestos: this.precio * 0.8,
      impuesto: this.precio * 0.2,
      total: this.precio
    }

    return precios;
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
  return carrito.some((prod) => prod.id === idBuscado);
}

// 3. Funciones para manipular el carrito de compras
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

function agregarProductoFinal() {
  const id = parseInt(prompt("Ingresá el ID del producto:"));
  if (isNaN(id)) {
    alert("ID no válido.");
    return;
  }

  if (existeId(id)) {
    alert("Error: Ya existe un producto con el ID " + id + ". Ingresá un ID diferente.");
    return;
  }

  const nombre = prompt("Ingresá el nombre del producto para sumar al carrito:");
  if (nombre) {
    const precio = parseFloat(prompt("Ingresá el precio del producto:"));
    if (!isNaN(precio)) {
      const stock = parseInt(prompt("Ingresá la cantidad de stock disponibles:"));
      if (!isNaN(stock) && stock >= 0) {
        const nuevoProducto = new Producto(id, nombre, precio, stock);
        carrito.push(nuevoProducto);
        alert("Se agregó '" + nuevoProducto.nombre + "' al final del carrito.");
      } else {
        alert("Stock no válido.");
      }
    } else {
      alert("Precio no válido.");
    }
  } else if (nombre !== null) {
    alert("No ingresaste un producto válido.");
  }
}

function agregarProductoInicio() {
  const id = parseInt(prompt("Ingresá el ID del producto prioritario:"));
  if (isNaN(id)) {
    alert("ID no válido.");
    return;
  }

  if (existeId(id)) {
    alert("Error: Ya existe un producto con el ID " + id + ". Ingresá un ID diferente.");
    return;
  }

  const nombre = prompt("Ingresá el producto urgente/prioritario a sumar al inicio:");
  if (nombre) {
    const precio = parseFloat(prompt("Ingresá el precio del producto:"));
    if (!isNaN(precio)) {
      const stock = parseInt(prompt("Ingresá la cantidad de stock disponibles:"));
      if (!isNaN(stock) && stock >= 0) {
        const nuevoProducto = new Producto(id, nombre, precio, stock);
        carrito.unshift(nuevoProducto);
        alert("Se agregó '" + nuevoProducto.nombre + "' al inicio de la lista.");
      } else {
        alert("Stock no válido.");
      }
    } else {
      alert("Precio no válido.");
    }
  } else if (nombre !== null) {
    alert("No ingresaste un producto válido.");
  }
}

function quitarUltimoProducto() {
  if (carrito.length > 0) {
    const eliminado = carrito.pop();
    alert("Se ha eliminado el elemento: " + eliminado.nombre);
  } else {
    alert("El carrito ya está vacío, no hay productos para eliminar.");
  }
}

function reemplazarProductoPorIndice() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const indiceTexto = prompt(
    "Ingresá la posición (0 a " + (carrito.length - 1) + ") del producto que deseas cambiar:"
  );

  if (indiceTexto !== null && indiceTexto !== "") {
    const indice = parseInt(indiceTexto);

    if (!isNaN(indice) && indice >= 0 && indice < carrito.length) {
      const id = parseInt(prompt("Ingresá el ID del nuevo producto:"));
      if (isNaN(id)) {
        alert("ID no válido.");
        return;
      }

      if (existeId(id)) {
        alert("Error: Ya existe un producto con el ID " + id + ".");
        return;
      }

      const nombre = prompt("Ingresá el nombre del nuevo producto:");
      if (nombre) {
        const precio = parseFloat(prompt("Ingresá el precio:"));
        if (!isNaN(precio)) {
          const stock = parseInt(prompt("Ingresá el stock:"));
          if (!isNaN(stock) && stock >= 0) {
            const reemplazo = new Producto(id, nombre, precio, stock);
            const anterior = carrito.splice(indice, 1, reemplazo);
            alert("Se reemplazó '" + anterior[0].nombre + "' por '" + reemplazo.nombre + "'.");
          } else {
            alert("Stock no válido.");
          }
        } else {
          alert("Precio no válido.");
        }
      } else if (nombre !== null) {
        alert("No ingresaste un nombre válido.");
      }
    } else {
      alert("Posición no válida. Debe ser un número entre 0 y " + (carrito.length - 1) + ".");
    }
  }
}

function buscarProductoYConsultarPrecio() {
  const busqueda = prompt("Ingresá el nombre exacto o ID del producto a buscar en el carrito:");

  if (busqueda) {
    const productoEncontrado = carrito.find(
      (prod) => prod.nombre.toLowerCase() === busqueda.toLowerCase() || prod.id.toString() === busqueda
    );

    if (productoEncontrado) {
      const posicion = carrito.indexOf(productoEncontrado);
      const precios = productoEncontrado.verImpuestos();
      alert(
        "El producto '[ID: " + productoEncontrado.id + "] " + productoEncontrado.nombre + "' está en el carrito (posición " + posicion +
        ")\nPrecio sin impuestos: $" + precios.sinImpuestos +
        "\nPrecio final con impuestos: $" + precios.total +
        "\nStock disponible: " + productoEncontrado.stock + " unidades"
      );
    } else {
      alert("El producto '" + busqueda + "' no está en el carrito. Podés agregarlo desde el menú.");
    }
  } else if (busqueda !== null) {
    alert("No ingresaste ningún término de búsqueda.");
  }
}

// 4. Función principal: únicamente controla el flujo y ejecuta las funciones
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

// Ejecución
simuladorCarrito();