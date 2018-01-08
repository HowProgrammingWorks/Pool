'use strict';

const duplicate = (factory, n) => (
  new Array(n).fill().map(() => factory())
);

const poolify = (factory, min, norm, max) => {
  let allocated = norm;
  const pool = (par) => {
    if (typeof(par) !== 'function') {
      if (pool.items.length < max) {
        const delayed = pool.delayed.pop();
        if (delayed) {
          console.log('Recycle item, pass to delayed', pool.items.length);
          delayed(par);
        } else {
          console.log('Recycle item, add to pool', pool.items.length);
          pool.items.push(par);
        }
      }
      return;
    }
    if (pool.items.length < min && allocated < max) {
      const grow = Math.min(max - allocated, norm - pool.items.length);
      allocated += grow;
      const items = duplicate(factory, grow);
      pool.items.push(...items);
    }
    const res = pool.items.pop();
    if (res) {
      console.log('Get from pool, pass to callback', pool.items.length);
      par(res);
    } else {
      console.log('Get from pool, add callback to queue', pool.items.length);
      pool.delayed.push(par);
    }
  };
  return Object.assign(pool, {
    items: duplicate(factory, norm),
    delayed: []
  });
};

// Usage

// Factory to allocate 4kb buffer
const buffer = () => new Uint32Array(128);

// Allocate pool of 10 buffers
const pool = poolify(buffer, 3, 5, 7);

let i = 0;

const next = () => {
  pool(item => {
    i++;
    if (i < 20) {
      setTimeout(next, i * 10);
      setTimeout(() => pool(item), i * 100);
    }
  });
};

next();
