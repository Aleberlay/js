// 1. Array de productos iniciales en el carrito
const carrito = [
  "Auriculares Redragon",
  "Teclado Noga",
  "Mouse GX",
  "Monitor 24 Pulgadas",
  "Monitor 27 Pulgadas"
];

// 2. Función flecha para calcular el precio estimado de un producto
const obtenerPrecio = (producto) => {
  if (producto === "Auriculares Redragon") {
    return 45000;
  }
  if (producto === "Teclado Noga") {
    return 60000;
  }
  if (producto === "Mouse GX") {
    return 30000;
  }
  if (producto === "Monitor 24 Pulgadas") {
    return 120000;
  }
  if (producto === "Monitor 27 Pulgadas") {
    return 200000;
  }
  return 10000; // Precio por defecto para productos nuevos agregados dinámicamente
};

// 3. Función con for...of para listar los productos del carrito
function mostrarCarrito(listaProductos) {
  console.log("--- ARTÍCULOS EN EL CARRITO ---");
  for (const producto of listaProductos) {
    console.log("Producto: " + producto);
  }
}

// 4. Función principal interactiva del simulador
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
      case "1": {
        mostrarCarrito(carrito);
        alert("Visualiza la consola para ver los productos.");
        break;
      }

      case "2": {
        const nuevoProducto = prompt("Ingresá el nombre del producto para sumar al carrito:");
        if (nuevoProducto) {
          carrito.push(nuevoProducto);
          alert("Se agregó '" + nuevoProducto + "' al final del carrito.");
        } else if (nuevoProducto !== null) {
          alert("No ingresaste un producto válido.");
        }
        break;
      }

      case "3": {
        const productoPrioritario = prompt("Ingresá el producto urgente/prioritario a sumar al inicio:");
        if (productoPrioritario) {
          carrito.unshift(productoPrioritario);
          alert("Se agregó '" + productoPrioritario + "' al inicio de la lista.");
        } else if (productoPrioritario !== null) {
          alert("No ingresaste un producto válido.");
        }
        break;
      }

      case "4": {
        if (carrito.length > 0) {
          const eliminado = carrito.pop();
          alert("Se ha eliminado el elemento: " + eliminado);
        } else {
          alert("El carrito ya está vacío, no hay productos para eliminar.");
        }
        break;
      }

      case "5": {
        const indiceTexto = prompt(
          "Ingresá la posición (0 a " + (carrito.length - 1) + ") del producto que deseas cambiar:"
        );

        if (indiceTexto !== null && indiceTexto.trim() !== "") {
          const indice = Number(indiceTexto);
          if (Number.isInteger(indice) && indice >= 0 && indice < carrito.length) {
            const reemplazo = prompt("Ingresá el nombre del nuevo producto:");
            if (reemplazo) {
              const anterior = carrito.splice(indice, 1, reemplazo);
              alert("Se reemplazó '" + anterior[0] + "' por '" + reemplazo + "'.");
            } else if (reemplazo !== null) {
              alert("No ingresaste un nombre válido.");
            }
          } else {
            alert("Posición no válida. Debe ser un número entre 0 y " + (carrito.length - 1) + ".");
          }
        }
        break;
      }

      case "6": {
        const busqueda = prompt("Ingresá el nombre exacto del producto a buscar en el carrito:");

        if (busqueda) {
          if (carrito.includes(busqueda)) {
            const posicion = carrito.indexOf(busqueda);
            const precio = obtenerPrecio(busqueda);
            alert(
              "El producto '" + busqueda + "' está en el carrito (posición " + posicion +
              ") y su precio es de: $" + precio
            );
          } else {
            alert("El producto '" + busqueda + "' no está en el carrito. Podés agregarlo desde el menú.");
          }
        } else if (busqueda !== null) {
          alert("No ingresaste ningún término de búsqueda.");
        }
        break;
      }

      case "7":
      case null: {
        alert("¡Gracias por visitar la tienda!");
        break;
      }

      default: {
        alert("Opción no válida. Por favor, seleccioná un número del 1 al 7.");
        break;
      }
    }
  }
}

// Ejecución
simuladorCarrito();
