// Array
const listaComponentes = [
  "Placa de Video RTX 3060",
  "Placa de Video RTX 4070",
  "Placa de Video RX 6600",
  "Procesador Ryzen 5",
  "Procesador Ryzen 7",
  "Procesador Core i5"
];

// 1. FLECHA para obtener el consumo de watts de cada componente
const obtenerConsumoWatts = (componente) => {
  if (componente === "Placa de Video RX 6700 XT") return 230;
  if (componente === "Placa de Video RTX 4070") return 200;
  if (componente === "Placa de Video RTX 3060") return 170;
  if (componente === "Placa de Video RX 6600") return 132;
  if (componente === "Procesador Ryzen 7" || componente === "Procesador Core i7") return 105;
  if (componente === "Procesador Ryzen 5" || componente === "Procesador Core i5") return 65;
};

// 2. For...of para mostrar el reporte de componentes
function mostrarReportePC(arrayComponentes) {
  console.log("--- LISTA COMPLETA DE COMPONENTES ---");
  for (const componente of arrayComponentes) {
    console.log("Producto: " + componente);
  }
}

// 3. Funcion principal del simulador de armado de PC
function simuladorArmadoPC() {
  // Push y unshift
  listaComponentes.push("Procesador Pentium G4560");
  listaComponentes.unshift("Placa de Video RTX 3050");

  // Eliminar el último elemento del array y mostrarlo en una alerta
  const eliminado = listaComponentes.pop();
  alert("Se ha eliminado por discontinuidad: " + eliminado);

  // Splice
  listaComponentes.splice(2, 1, "Placa de Video RX 6700 XT");

  // Entradas y búsqueda
  const busqueda = prompt("Ingresá el componente para consultar cuántos Watts gasta:");

  if (listaComponentes.includes(busqueda)) {
    const posicion = listaComponentes.indexOf(busqueda);

    // Invocación a la función flecha para obtener el consumo (retorno)
    const wattsConsumo = obtenerConsumoWatts(busqueda);

    alert("En la posición " + posicion + " está '" + busqueda + "' y gasta aproximadamente: " + wattsConsumo + " Watts");
  } else {
    alert("El componente '" + busqueda + "' no se encuentra en la lista, por favor verifica la ortografía o el stock");
  }

  // Invocación a la función de reporte
  mostrarReportePC(listaComponentes);
}

// Ejecución de la simulación
simuladorArmadoPC();