'use strict';

class Pool {
  constructor() {
    this.items = [];
    this.free = [];
    this.current = 0;
    this.size = 0;
    this.available = 0;
  }

  next() {
    if (this.available === 0) return null;
    let item = null;
    let free = false;
    do {
      item = this.items[this.current];
      free = this.free[this.current];
      this.current++;
    } while (!item || !free);
    if (this.current === this.size) this.current = 0;
    return item;
  }

  add(item) {
    if (this.items.includes(item)) throw new Error('Pool: add duplicates');
    this.size++;
    this.available++;
    this.items.push(item);
    this.free.push(true);
  }

  capture() {
    const item = this.next();
    if (!item) return null;
    const index = this.items.indexOf(item);
    this.free[index] = false;
    this.available--;
    return item;
  }

  release(item) {
    const index = this.items.indexOf(item);
    if (index < 0) throw new Error('Pool: release unexpected item');
    if (this.free[index]) throw new Error('Pool: release not captured');
    this.free[index] = true;
    this.available++;
  }
}

// Usage

const pool = new Pool();
pool.add({ item: 1 });
pool.add({ item: 2 });
const last = { item: 3 };
pool.add(last);

for (let i = 0; i < 10; i++) {
  console.log(pool.capture());
  if (i === 5) pool.release(last);
}
