'use strict';

const poolify = (factory, min, norm, max) => {
  const duplicate = n => new Array(n).fill().map(() => factory());
  const items = duplicate(norm);

  return item => {
    if (item) {
      if (items.length < max) {
        items.push(item);
      }
      console.log('Recycle item, count =', items.length);
      return;
    }
    if (items.length < min) {
      const instances = duplicate(norm - items.length);
      items.push(...instances);
    }
    const res = items.pop();
    console.log('Get from pool, count =', items.length);
    return res;
  };
};

// Usage

// Factory to allocate 4kb buffer
const buffer = () => new Uint32Array(1024);

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
