const x = 5; // Error: espaciado incorrecto alrededor del operador

let y = "hello"; // Error: espaciado incorrecto en la asignación

var z = 10; // Advertencia: uso de 'var' en lugar de 'let' o 'const'

if (x == 5) { // Error: espaciado incorrecto alrededor del operador de comparación
    console.log("x es 5");
}

function hello() {
    console.log("Hello, World");
}  // Advertencia: sangría incorrecta (debe ser consistente)


const unOrderedObject = {
    a: 1,
    c: 2,
    d: 3,
    b: 4
}

function doSomethingThatMightThrow() {
  return 1 + 1;
}

try {
  doSomethingThatMightThrow();
} catch (e) {
  throw e;
}

try {
  doSomethingThatMightThrow();
} catch (e) {
  console.log(e);
}