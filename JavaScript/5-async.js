'use strict';

const poolify = (factory, min, norm, max) => {

  const duplicate = n => new Array(n).fill().map(() => factory());

  const pool = (par) => {
    if (typeof(par) !== 'function') {
      if (pool.items.length < max) {
        const delayed = pool.delayed.pop();
        if (delayed) {
          console.log('Recycle item, pass to delayed');
          delayed(par);
          return;
        } else {
          pool.items.push(par);
        }
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
    if (res) {
      par(res);
    } else {
      pool.delayed.push(par);
      console.log('Request delayed');
    }
    return pool;
  };

  return Object.assign(pool, {
    items: duplicate(norm),
    delayed: []
  });

};

// Usage

// Factory to allocate 4kb buffer
const buffer = () => new Uint32Array(128);

// Allocate pool of 10 buffers
const pool = poolify(buffer, 0, 5, 10);

let i = 0;

const next = () => {
  pool(item => {
    console.log('Buffer size', item.length * 32);
    i++;
    if (i < 10) {
      setTimeout(next, i * 10);
      setTimeout(() => pool(item), i * 100);
    }
  });
};

next();
