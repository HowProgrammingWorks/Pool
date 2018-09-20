'use strict';

const pool = item => {
  pool.items = pool.items || new Array(10).fill(new Array(1000).fill(0));

  if (item) {
    pool.items.push(item);
    console.log('Recycle item, count =', pool.items.length);
    return;
  }
  const res = pool.items.pop() || new Array(1000).fill(0);

  console.log('Get from pool, count =', pool.items.length);
  return res;
};

// Usage

for (let i = 0; i < 15; i++) {
  const a1 = pool();
  const b1 = a1.map((x, i) => i).reduce((x, y) => x + y);
  console.log(b1);
}
