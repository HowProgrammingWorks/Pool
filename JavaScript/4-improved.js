'use strict';

const poolify = (factory, min, norm, max) => {

  const duplicate = n => new Array(n).fill().map(() => factory());

  const pool = (item) => {
    if (item) {
      if (pool.items.length < max) {
        pool.items.push(item);
      }
      console.log('Recycle item, count =', pool.items.length);
      return;
    }
    if (pool.items.length < min) {
      const items = duplicate(norm - pool.items.length);
      pool.items.push(...items);
    }
    const res = pool.items.pop();

    console.log('Get from pool, count =', pool.items.length);
    return res;
  };

  const items = duplicate(norm);
  return Object.assign(pool, { items });

};

// Usage

// Factory to allocate 4kb buffer
const buffer = () => new Uint32Array(128);

// Allocate pool of 10 buffers
const pool = poolify(buffer, 5, 10, 15);

let i = 0;

const next = () => {
  const item = pool();
  console.log('Buffer size', item.length * 32);
  i++;
  if (i < 20) {
    setTimeout(next, i * 10);
    setTimeout(() => pool(item), i * 100);
  }
};

next();
