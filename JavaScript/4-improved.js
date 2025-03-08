'use strict';

const poolify = (factory, { size, max }) => {
  const instances = new Array(size).fill(null).map(factory);

  const acquire = () => instances.pop() || factory();

  const release = (instance) => {
    if (instances.length < max) {
      instances.push(instance);
    }
  };

  return { acquire, release };
};

// Usage

const createBuffer = (size) => new Uint8Array(size);

const FILE_BUFFER_SIZE = 4096;
const createFileBuffer = () => createBuffer(FILE_BUFFER_SIZE);

const pool = poolify(createFileBuffer, { size: 10, max: 15 });
const instance = pool.acquire();
console.log({ instance });
pool.release(instance);
