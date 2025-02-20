'use strict';

class Pool {
  constructor() {
    this.instances = [];
    this.free = [];
    this.queue = [];
    this.current = 0;
    this.size = 0;
    this.available = 0;
  }

  async acquire() {
    if (this.size === 0) return null;
    if (this.available === 0) {
      return new Promise((resolve) => {
        this.queue.push(resolve);
      });
    }
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

  async capture() {
    const instance = await this.acquire();
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
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      if (resolve) setTimeout(resolve, 0, instance);
    }
  }
}

// Usage

const main = async () => {
  const pool = new Pool();
  const instance1 = { instance: 1 };
  pool.add(instance1);
  const instance2 = { instance: 2 };
  pool.add(instance2);
  const instance3 = { instance: 3 };
  pool.add(instance3);

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
  });

  pool.release(instance2);
  pool.release(instance1);
  pool.release(instance3);
};

main();
