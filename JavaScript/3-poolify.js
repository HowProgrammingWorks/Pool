'use strict';

const poolify = (factory, size) => {

  const pool = (item) => {
    if (item) {
      pool.items.push(item);
      console.log('Recycle item, count =', pool.items.length);
      return;
    }
    const res = pool.items.pop() || factory();

    console.log('Get from pool, count =', pool.items.length);
    return res;
  };

  const items = new Array(size).fill().map(() => factory());
  return Object.assign(pool, { items });

};

// Usage

// Factory to allocate 4kb buffer
const buffer = () => new Uint32Array(128);

// Allocate pool of 10 buffers
const pool = poolify(buffer, 10);

for (let i = 0; i < 15; i++) {
  const a = pool();
  console.log('Buffer size', a.length * 32);
}
