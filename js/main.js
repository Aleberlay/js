// Simulador: Calculadora de Edad y Etapa de Vida para 2030
const ANIO_ACTUAL = 2030;

function iniciarSimulador() {
  let continuar = true;

  // BUCLE: Repite la consulta hasta que el usuario decida salir
  while (continuar) {
    let nombre = prompt("Ingrese el nombre de la persona (o escriba 'ESC' para salir):");

    // CONDICIONAL: Verificar si el usuario quiere terminar la ejecución
    if (nombre === null || nombre.toUpperCase() === "ESC") {
      continuar = false;
      alert("Gracias por usar el simulador. ¡Hasta luego!");
    } else {
      let anioNacimiento = parseInt(prompt("Ingrese el año de nacimiento de " + nombre + ":"));

      // Validador de dato ingresado
      if (isNaN(anioNacimiento) || anioNacimiento > ANIO_ACTUAL || anioNacimiento < 1900) {
        alert("Por favor, ingrese un año de nacimiento válido.");
      } else {
        let edadCalculada = ANIO_ACTUAL - anioNacimiento;
        let etapa = "";

        // CONDICIONALES DENTRO DEL BUCLE: Clasificación por edad
        if (edadCalculada < 18) {
          etapa = "menor de edad";
        } else if (edadCalculada >= 18 && edadCalculada < 65) {
          etapa = "un adulto";
        } else {
          etapa = "un adulto mayor";
        }

        // Resultado final
        let mensaje = nombre + " tendrá " + edadCalculada + " años en el " + ANIO_ACTUAL + " y será " + etapa + ".";
        
        alert(mensaje);
        console.log(mensaje);
      }
    }
  }
}

// Conectar el botón del HTML con la función iniciarSimulador
let boton = document.getElementById("btnIniciar");
boton.addEventListener("click", iniciarSimulador);