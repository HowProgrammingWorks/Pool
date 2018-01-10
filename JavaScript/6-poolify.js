'use strict';

const poolified = Symbol('poolified');

const mixFlag = { [poolified]: true };

const duplicate = (factory, n) => (
  new Array(n).fill().map(() => {
    const instance = factory();
    return Object.assign(instance, mixFlag);
  })
);

const provide = callback => item => {
  setImmediate(() => {
    callback(item);
  });
};

const poolify = (factory, min, norm, max) => {
  let allocated = norm;
  const pool = (par) => {
    if (par[poolified]) {
      const delayed = pool.delayed.shift();
      if (delayed) delayed(par);
      else pool.items.push(par);
      return;
    }
    const callback = provide(par);
    if (pool.items.length < min && allocated < max) {
      const grow = Math.min(max - allocated, norm - pool.items.length);
      allocated += grow;
      const items = duplicate(factory, grow);
      pool.items.push(...items);
    }
    const res = pool.items.pop();
    if (res) callback(res);
    else pool.delayed.push(callback);
  };
  return Object.assign(pool, {
    items: duplicate(factory, norm),
    delayed: []
  });
};

// Usage

const adder = a => b => adder(a + b);

const pool = poolify(adder, 1, 2, 3);

console.log('request Item1');
pool(item1 => {
  console.log('get Item1');
  console.log('request Item2');
  pool(item2 => {
    console.log('get Item2');
    console.log('request Item3');
    pool(item3 => {
      console.log('get Item3');
      setTimeout(() => {
        pool(item3);
        console.log('recycle Item3');
      }, 50);
    });
    console.log('request Item4');
    pool(item4 => {
      console.log('get Item4');
      setTimeout(() => {
        pool(item4);
        console.log('recycle Item4');
      }, 20);
    });
    setTimeout(() => {
      pool(item1);
      console.log('recycle Item1');
      setTimeout(() => {
        pool(item2);
        console.log('recycle Item2');
      }, 10);
    }, 10);
  });
});
