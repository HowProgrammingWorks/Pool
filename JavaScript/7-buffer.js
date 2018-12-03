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

      console.dir({
        action: 'Recycle item',
        length: pool.items.length,
        allocated: pool.allocated
      });
      return;
    }
    if (pool.items.length < min) {
      const items = duplicate(norm - pool.items.length);
      pool.allocated += items.length;
      pool.items.push(...items);
    }
    const res = pool.items.pop();

    console.dir({
      action: 'Get item',
      length: pool.items.length,
      allocated: pool.allocated
    });
    return res;
  };

  const items = duplicate(norm);
  return Object.assign(pool, { items, allocated: norm });
};

const factorify = (Category, ...args) => () => new Category(...args);

// Usage

const factory = factorify(Uint32Array, 1024);
const pool = poolify(factory, 5, 10, 13);

let i = 0;

const next = () => {
  const item = pool();
  //console.log('Buffer size', item.length * 32);
  i++;
  if (i < 20) {
    setTimeout(next, i * 10);
    setTimeout(() => pool(item), i * 100);
  }
};

next();
