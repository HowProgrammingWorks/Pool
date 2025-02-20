'use strict';

const poolify = (factory, size) => {
  const instances = new Array(size).fill(null).map(factory);

  const acquire = () => {
    const instance = instances.pop() || factory();
    console.log('Get from pool, count =', instances.length);
    return instance;
  };

  const release = (instance) => {
    instances.push(instance);
    console.log('Recycle item, count =', instances.length);
  };

  return { acquire, release };
};

// Usage

// Factory to allocate 32kb buffer
const buffer = () => new Uint32Array(1024);

// Allocate pool of 10 buffers
const pool = poolify(buffer, 10);

for (let i = 0; i < 15; i++) {
  const data = pool.acquire();
  console.log('Buffer size', data.length * 32);
}
