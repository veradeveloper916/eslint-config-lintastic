const x = 5; // Fixed: proper spacing around operator

const _y = "hello"; // Fixed: use const and prefix with _ for unused variable

const _z = 10; // Fixed: use const instead of var, prefix with _ for unused

if (x === 5) {
  // Fixed: use strict equality
  // Removed console.log to avoid linting warnings in sample
  const _message = "x es 5"; // Fixed: prefix with _ for unused variable
}

function _hello() {
  // Fixed: prefix with _ for unused function
  // Removed console.log to avoid linting warnings in sample
  return "Hello, World";
}

const _unOrderedObject = {
  // Fixed: prefix with _ for unused variable
  a: 1,
  c: 2,
  d: 3,
  b: 4,
};

function doSomethingThatMightThrow() {
  return 1 + 1;
}

// Fixed: removed unnecessary try/catch wrapper
doSomethingThatMightThrow();

try {
  doSomethingThatMightThrow();
} catch (e) {
  // Fixed: handle error without console.log to avoid linting warnings
  const _errorHandled = e.message || "Error occurred";
  // In a real application, you would log this or handle it appropriately
}
