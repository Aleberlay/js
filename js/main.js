// Solicitar al usuario que ingrese su nombre, apellido y edad
const nombre = prompt("Ingrese su nombre:");
const aniosTexto = prompt("Ingrese su edad:");
const anioNacimientoTexto = prompt("Ingrese su año de nacimiento:");

// Procesar la información ingresada
const anios = parseInt(aniosTexto);
const anioNacimiento = parseInt(anioNacimientoTexto);

// Cálculo matemático para verificar la edad ingresada
const anioActual = new Date().getFullYear();
let edadCalculada = anioActual - anioNacimiento;

// Transferencia de texto
const mensaje = "Hola " + nombre + ", naciste en el año " + anioNacimiento + " y tienes " + anios + " años.";

// Mostrar el mensaje en la consola
alert(mensaje);
console.log(mensaje);