'use strict';

const poolified = Symbol('poolified');

const mixSymbol = { [poolified]: true };

const duplicate = (factory, n) =>
  new Array(n).fill(null).map(() => {
    const instance = factory();
    return Object.assign(instance, mixSymbol);
  });

const provide = (callback) => (data) => {
  setImmediate(() => {
    callback(data);
  });
};

const poolify = (factory, { size, max }) => {
  let allocated = size;
  const instances = duplicate(factory, size);
  const delayed = [];

  const acquire = (callback) => {
    const request = provide(callback);
    if (instances.length === 0 && allocated < max) {
      const grow = Math.min(max - allocated, size - instances.length);
      allocated += grow;
      const addition = duplicate(factory, grow);
      instances.push(...addition);
    }
    const instance = instances.pop();
    if (instance) request(instance);
    else delayed.push(request);
  };

  const release = (instance) => {
    if (!instance[poolified]) return;
    if (delayed.length > 0) {
      const request = delayed.shift();
      return void request(instance);
    }
    if (instances.length < max) {
      instances.push(instance);
    }
  };

  return { acquire, release };
};

// Usage

const adder = (a) => (b) => adder(a + b);

const pool = poolify(adder, { size: 2, max: 3 });

console.log('request Item1');
pool.acquire((instance1) => {
  console.log('get instance1');
  console.log('request instance2');
  pool.acquire((instance2) => {
    console.log('get instance2');
    console.log('request instance3');
    pool.acquire((instance3) => {
      console.log('get instance3');
      setTimeout(() => {
        pool.release(instance3);
        console.log('recycle instance3');
      }, 50);
    });
    console.log('request instance4');
    pool.acquire((instance4) => {
      console.log('get instance4');
      setTimeout(() => {
        pool.release(instance4);
        console.log('recycle instance4');
      }, 20);
    });
    setTimeout(() => {
      pool.release(instance1);
      console.log('recycle instance1');
      setTimeout(() => {
        pool.release(instance2);
        console.log('recycle instance2');
      }, 10);
    }, 10);
  });
});
