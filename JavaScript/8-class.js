'use strict';

class Pool {
  constructor() {
    this.instances = [];
    this.current = 0;
  }

  acquire() {
    const instance = this.instances[this.current];
    this.current++;
    if (this.current === this.instances.length) this.current = 0;
    return instance;
  }

  release(instance) {
    if (this.instances.includes(instance)) {
      throw new Error('Pool: add duplicates');
    }
    this.instances.push(instance);
  }
}

// Usage

const pool = new Pool();
pool.release({ instance: 1 });
pool.release({ instance: 2 });
pool.release({ instance: 3 });

for (let i = 0; i < 10; i++) {
  console.log(pool.acquire());
}
