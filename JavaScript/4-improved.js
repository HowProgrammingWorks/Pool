'use strict';

const poolify = (factory, { size, max }) => {
  const duplicate = (n) => new Array(n).fill(null).map(factory);

  const instances = duplicate(size);

  const acquire = () => {
    const instance = instances.pop() || factory();
    console.log('Get from pool, count =', instances.length);
    return instance;
  };

  const release = (instance) => {
    if (instances.length < max) {
      instances.push(instance);
    }
    console.log('Recycle item, count =', instances.length);
  };

  return { acquire, release };
};

// Usage

const buffer = () => new Uint32Array(1024);

const pool = poolify(buffer, { size: 10, max: 15 });

let i = 0;
const next = () => {
  const data = pool.acquire();
  console.log('Buffer size', data.length * 32);
  i++;
  if (i < 20) {
    setTimeout(next, i * 10);
    setTimeout(() => pool.release(data), i * 100);
  }
};

next();
