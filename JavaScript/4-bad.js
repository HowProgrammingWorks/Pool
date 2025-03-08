'use strict';

const poolify = (factory, options, size, max) => {
  const instances = [];
  for (let i = 0; i < size; i++) {
    const instance = factory(...options);
    instances.push(instance);
  }

  return (instance) => {
    if (instance) {
      if (instances.length < max) {
        instances.push(instance);
      }
    }
    instance = instances.pop();
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
