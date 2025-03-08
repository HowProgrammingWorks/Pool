'use strict';

// TODO: Refactor to respect SoC principle and
// optimize JavaScript for V8

const poolify = (factory, options, size, max) => {
  const instances = []; // Preallocate array
  for (let i = 0; i < size; i++) { // Use Array methods instead of loop
    const instance = factory(...options); // Avoid array destructuring
    instances.push(instance);
  }

  return (instance) => { // Respect SoC and SOLID/SRP
    if (instance) { // Avoid if-statement
      if (instances.length < max) {
        instances.push(instance);
      }
    }
    instance = instances.pop(); // Do not reassign incoming parameters
    if (!instance) instance = factory(...options);
    return instance;
  };
};

// Usage

const createBuffer = (size) => new Uint8Array(size);
const pool = poolify(createBuffer, [4096], 10, 15);

const instance = pool();
console.log({ instance });
pool(instance);
