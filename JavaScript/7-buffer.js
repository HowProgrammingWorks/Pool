'use strict';

const poolify = (factory, min, norm, max) => {
  const duplicate = n => new Array(n).fill().map(() => factory());

  const pool = item => {
    if (item) {
      if (pool.allocated <= max) {
        pool.items.push(item);
      } else {
        pool.allocated--;
      }
      console.log('Recycle item, count =', pool.items.length, pool.allocated);
      return;
    }
    if (pool.items.length < min) {
      const items = duplicate(norm - pool.items.length);
      pool.allocated += pool.items.length;
      pool.items.push(...items);
    }
    const res = pool.items.pop();

    console.log('Get item, count =', pool.items.length, pool.allocated);
    return res;
  };

  const items = duplicate(norm);
  return Object.assign(pool, { items, allocated: norm });
};

// Usage

const buffer = () => new Uint32Array(1024);

const pool = poolify(buffer, 5, 10, 13);

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
