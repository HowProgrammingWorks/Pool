'use strict';

const pool = item => {
  pool.items = pool.items || new Array(10).fill(new Array(1000).fill(0));

  if (item) {
    pool.items.push(item);
    console.log('Recycle item, count =', pool.items.length);
    return;
  }

  const res = pool.items.pop();
  console.log('Get from pool, count =', pool.items.length);
  return res;
};

// Usage

const a1 = pool();
const b1 = a1.map((x, i) => i).reduce((x, y) => x + y);
console.log(b1);

const a2 = pool();
const b2 = a2.map((x, i) => i).reduce((x, y) => x + y);
console.log(b2);

pool(a1);
pool(a2);

const a3 = pool();
const b3 = a3.map((x, i) => i).reduce((x, y) => x + y);
console.log(b3);

pool(a3);
