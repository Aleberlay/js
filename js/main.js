// Simulador: Calculadora de Edad y Etapa de Vida para 2030
const anioActual = 2030;

// 1. Función de Entrada de Datos
function solicitarDato(mensaje) {
  return prompt(mensaje);
}

// 2. Función de Procesamiento con return (Calcula la edad)
function calcularEdad(anioNacimiento, anioReferencia) {
  return anioReferencia - anioNacimiento;
}

// 3. Función Flecha (Determina la etapa de vida según la edad)
const determinarEtapa = (edad) => {
  if (edad < 18) {
    return "menor de edad";
  } else if (edad < 65) {
    return "un adulto";
  } else {
    return "un adulto mayor";
  }
};

// 4. Función de Salida de Datos (Muestra el resultado final)
function mostrarResultado(nombre, edad, etapa, anio) {
  alert(nombre + " tendrá " + edad + " años en el " + anio + " y será " + etapa + ".");
}

// FLUIJO PRINCIPAL DEL SIMULADOR
let continuar = true;

// BUCLE: Repite la consulta hasta que el usuario decida salir
while (continuar) {
  let nombre = solicitarDato("Ingrese el nombre de la persona (o escriba 'ESC' para salir):");

  // CONDICIONAL: Verificar si el usuario quiere terminar la ejecución
  if (nombre === null || nombre.toUpperCase() === "ESC") {
    continuar = false;
    alert("Gracias por usar el simulador. ¡Hasta luego!");
    continue;
  }

  let anioNacimiento = parseInt(solicitarDato("Ingrese el año de nacimiento de " + nombre + ":"));

  // Validador de dato ingresado
  if (isNaN(anioNacimiento) || anioNacimiento > anioActual || anioNacimiento < 1900) {
    alert("Por favor, ingrese un año de nacimiento válido.");
    continue;
  }

  // Invocación de las funciones de procesamiento
  let edadCalculada = calcularEdad(anioNacimiento, anioActual);
  let etapa = determinarEtapa(edadCalculada);

  // Resultado final directo
  mostrarResultado(nombre, edadCalculada, etapa, anioActual);
}