'use strict';

class Pool {
  constructor() {
    this.items = [];
    this.current = 0;
  }

  next() {
    const item = this.items[this.current];
    this.current++;
    if (this.current === this.items.length) this.current = 0;
    return item;
  }

  add(item) {
    if (this.items.includes(item)) throw new Error('Pool: add duplicates');
    this.items.push(item);
  }
}

// Usage

const pool = new Pool();
pool.add({ item: 1 });
pool.add({ item: 2 });
pool.add({ item: 3 });

for (let i = 0; i < 10; i++) {
  console.log(pool.next());
}
