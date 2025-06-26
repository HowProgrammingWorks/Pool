'use strict';

// TODO: Refactor to respect SoC principle and
// optimize JavaScript for V8

const poolify = (factory, options, size, max) => {
  const instances = []; // Preallocate array
  for (let i = 0; i < size; i++) { // Use Array methods instead of loop
    // In this case destructuring will be optimized by V8
    // https://github.com/v8/v8/blob/074bb97050edcb45ca33b250ebcb865279e61dd4/src/compiler/js-call-reducer.cc#L4542
    // It will change function to direct ::Call() that is C++ function instead of creation of iterator
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
