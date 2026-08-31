// Solicitar al usuario que ingrese su nombre, edad y año de nacimiento
let nombre = prompt("Ingrese su nombre:");
let anios = parseInt(prompt("Ingrese su edad actual:"));
let anioNacimiento = parseInt(prompt("Ingrese su año de nacimiento:"));

// Año objetivo para el cálculo
const ANIO_DESTINO = 2030;
let edadCalculada = ANIO_DESTINO - anioNacimiento;

// Transferencia de texto
let mensaje = "Hola " + nombre + ", en el año " + ANIO_DESTINO + " tendrás " + edadCalculada + " años.";

// Mostrar el mensaje al usuario
alert(mensaje);