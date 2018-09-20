'use strict';

const poolify = (factory, size) => {
  const items = new Array(size).fill(null).map(() => factory());

  return item => {
    if (item) {
      items.push(item);
      console.log('Recycle item, count =', items.length);
      return;
    }
    const res = items.pop() || factory();

    console.log('Get from pool, count =', items.length);
    return res;
  };
};

// Usage

// Factory to allocate 4kb buffer
const buffer = () => new Uint32Array(1024);

// Allocate pool of 10 buffers
const pool = poolify(buffer, 10);

for (let i = 0; i < 15; i++) {
  const a = pool();
  console.log('Buffer size', a.length * 32);
}
