'use strict';

class Pool {
  constructor(options = {}) {
    this.items = [];
    this.free = [];
    this.queue = [];
    this.timeout = options.timeout || 0;
    this.current = 0;
    this.size = 0;
    this.available = 0;
  }

  async next() {
    if (this.size === 0) return null;
    if (this.available === 0) {
      return new Promise((resolve, reject) => {
        const waiting = { resolve, timer: null };
        waiting.timer = setTimeout(() => {
          waiting.resolve = null;
          this.queue.shift();
          reject(new Error('Pool next item timeout'));
        }, this.timeout);
        this.queue.push(waiting);
      });
    }
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

  async capture() {
    const item = await this.next();
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
    if (this.queue.length > 0) {
      const { resolve, timer } = this.queue.shift();
      clearTimeout(timer);
      if (resolve) setTimeout(resolve, 0, item);
    }
  }
}

// Usage

(async () => {
  const pool = new Pool({ timeout: 5000 });
  pool.add({ item: 1 });
  pool.add({ item: 2 });
  const last = { item: 3 };
  pool.add(last);

  const x1 = await pool.capture();
  console.log({ x1 });
  const x2 = await pool.capture();
  console.log({ x2 });
  const x3 = await pool.capture();
  console.log({ x3 });

  pool.capture().then((x4) => {
    console.log({ x4 });
  });
  pool.capture().then((x5) => {
    console.log({ x5 });
  });
  pool.capture().then((x6) => {
    console.log({ x6 });
  }).catch((err) => {
    console.error({ err });
  });

  pool.release(x2);
  pool.release(x1);
  setTimeout(() => {
    pool.release(x3);
  }, 3000);
})();
