'use strict';

const duplicate = (factory, n) => new Array(n).fill(null).map(factory);

const poolify = (factory, { size, max }) => {
  let allocated = size;
  const instances = duplicate(factory, size);

  const acquire = () => {
    if (instances.length === 0 && allocated < max) {
      const grow = Math.min(max - allocated, size - instances.length);
      allocated += grow;
      const addition = duplicate(factory, grow);
      instances.push(...addition);
    }
    const instance = instances.pop();
    return instance;
  };

  const release = (instance) => {
    if (instances.length < max) {
      instances.push(instance);
    }
  };

  return { acquire, release };
};

const factorify =
  (Category, ...args) =>
  () =>
    new Category(...args);

// Usage

const factory = factorify(Uint32Array, 1024);
const pool = poolify(factory, { size: 10, max: 13 });

let i = 0;
const next = () => {
  const instance = pool.acquire();
  i++;
  if (i < 20) {
    setTimeout(next, i * 10);
    setTimeout(() => pool.release(instance), i * 100);
  }
};

next();
