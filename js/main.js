// Simulador: Calculadora de Edad y Etapa de Vida para 2030
const anioActual = 2030;
let continuar = true;

// BUCLE: Repite la consulta hasta que el usuario decida salir
while (continuar) {
  let nombre = prompt("Ingrese el nombre de la persona (o escriba 'ESC' para salir):");

  // CONDICIONAL: Verificar si el usuario quiere terminar la ejecución
  if (nombre === null || nombre.toUpperCase() === "ESC") {
    continuar = false;
    alert("Gracias por usar el simulador. ¡Hasta luego!");
    continue;
  }
  let anioNacimiento = parseInt(prompt("Ingrese el año de nacimiento de " + nombre + ":"));

  // Validador de dato ingresado
  if (isNaN(anioNacimiento) || anioNacimiento > anioActual || anioNacimiento < 1900) {
    alert("Por favor, ingrese un año de nacimiento válido.");
    continue;
  }
  let edadCalculada = anioActual - anioNacimiento;
  let etapa = "";

  // CONDICIONALES DENTRO DEL BUCLE: Clasificación por edad
  if (edadCalculada < 18) {
    etapa = "menor de edad";
  } else if (edadCalculada < 65) {
    etapa = "un adulto";
  } else {
    etapa = "un adulto mayor";
  }

  // Resultado final directo
  alert(nombre + " tendrá " + edadCalculada + " años en el " + anioActual + " y será " + etapa + ".");
  console.log(nombre + " tendrá " + edadCalculada + " años en el " + anioActual + " y será " + etapa + ".");
}