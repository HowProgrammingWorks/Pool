'use strict';

const duplicate = (factory, n) => new Array(n).fill(null).map(factory);

const poolify = (factory, { size, max, step }) => {
  let allocated = size;
  const instances = duplicate(factory, size);
  const delayed = [];

  const acquire = (callback) => {
    const c1 = instances.length;
    if (instances.length === 0 && allocated < max) {
      const grow = Math.min(max - allocated, size - instances.length);
      allocated += grow;
      console.log({ grow });
      const addition = duplicate(factory, grow);
      instances.push(...addition);
    }
    const instance = instances.pop();
    const c2 = instances.length;
    const delta = `Get from pool: ${c1}->${c2} of ${allocated}`;
    if (instance) {
      console.log(`${delta}, pass to callback`);
      callback(instance);
    } else {
      console.log(`${delta}, add callback to queue`);
      delayed.push(callback);
    }
  };

  const release = (instance) => {
    const c1 = instances.length;
    if (delayed.length > 0) {
      const request = delayed.shift();
      const delta = `Recycle item: ${c1}->${c1} of ${allocated}`;
      console.log(`${delta}, pass to delayed`);
      request(instance);
    } else {
      if (instances.length < max) {
        instances.push(instance);
      }
      const c2 = instances.length;
      const delta = `Recycle item: ${c1}->${c2} of ${allocated}`;
      console.log(`${delta}, add to pool`);
    }
  };

  return { acquire, release };
};

// Usage

const buffer = () => new Uint32Array(1024);

const pool = poolify(buffer, { size: 5, max: 7, step: 3 });

let i = 0;
const next = () => {
  pool.acquire((data) => {
    i++;
    if (i < 20) {
      setTimeout(next, i * 10);
      setTimeout(() => pool.release(data), i * 100);
    }
  });
};

next();
