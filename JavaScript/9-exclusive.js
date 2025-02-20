'use strict';

class Pool {
  constructor() {
    this.instances = [];
    this.free = [];
    this.current = 0;
    this.size = 0;
    this.available = 0;
  }

  acquire() {
    if (this.available === 0) return null;
    let instance = null;
    let free = false;
    do {
      instance = this.instances[this.current];
      free = this.free[this.current];
      this.current++;
      if (this.current === this.size) this.current = 0;
    } while (!instance || !free);
    return instance;
  }

  add(instance) {
    if (this.instances.includes(instance)) {
      throw new Error('Pool: add duplicates');
    }
    this.size++;
    this.available++;
    this.instances.push(instance);
    this.free.push(true);
  }

  capture() {
    const instance = this.acquire();
    if (!instance) return null;
    const index = this.instances.indexOf(instance);
    this.free[index] = false;
    this.available--;
    return instance;
  }

  release(instance) {
    const index = this.instances.indexOf(instance);
    if (index < 0) throw new Error('Pool: release unexpected instance');
    if (this.free[index]) throw new Error('Pool: release not captured');
    this.free[index] = true;
    this.available++;
  }
}

// Usage

const pool = new Pool();
pool.add({ instance: 1 });
pool.add({ instance: 2 });
const last = { instance: 3 };
pool.add(last);

for (let i = 0; i < 10; i++) {
  console.log(pool.capture());
  if (i === 5) pool.release(last);
}
