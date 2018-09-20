'use strict';

const duplicate = (factory, n) => (
  new Array(n).fill().map(() => factory())
);

const poolify = (factory, min, norm, max) => {
  let allocated = norm;
  const items = duplicate(factory, norm);
  const delayed = [];

  return par => {
    if (typeof par !== 'function') {
      if (items.length < max) {
        const request = delayed.shift();
        if (request) {
          const c1 = items.length;
          console.log(`${c1}->${c1} Recycle item, pass to delayed`);
          request(par);
        } else {
          const c1 = items.length;
          items.push(par);
          const c2 = items.length;
          console.log(`${c1}->${c2} Recycle item, add to pool`);
        }
      }
      return;
    }
    if (items.length < min && allocated < max) {
      const grow = Math.min(max - allocated, norm - items.length);
      allocated += grow;
      const instances = duplicate(factory, grow);
      items.push(...instances);
    }
    const c1 = items.length;
    const res = items.pop();
    const c2 = items.length;
    if (res) {
      console.log(`${c1}->${c2} Get from pool, pass to callback`);
      par(res);
    } else {
      console.log(`${c1}->${c2} Get from pool, add callback to queue`);
      delayed.push(par);
    }
  };
};

// Usage

// Factory to allocate 4kb buffer
const buffer = () => new Uint32Array(1024);

// Allocate pool of 10 buffers
const pool = poolify(buffer, 3, 5, 7);

let i = 0;

const next = () => {
  pool(item => {
    i++;
    if (i < 20) {
      setTimeout(next, i * 10);
      setTimeout(pool, i * 100, item);
    }
  });
};

next();
