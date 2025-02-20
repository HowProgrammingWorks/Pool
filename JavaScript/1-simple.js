'use strict';

class Connection {
  static index = 0;

  constructor(url) {
    this.url = url;
  }

  static create() {
    return new Connection(`http://10.0.0.1/${Connection.index++}`);
  }
}

const POOL_SIZE = 5;

const poolify = (factory) => {
  const instances = new Array(POOL_SIZE).fill(null).map(factory);

  const acquire = () => {
    const instance = instances.pop();
    console.log('Get from pool, count =', instances.length);
    return instance;
  };

  const release = (instance) => {
    instances.push(instance);
    console.log('Recycle item, count =', instances.length);
  };

  return { acquire, release };
};

// Usage

const pool = poolify(Connection.create);

for (let i = 0; i < 7; i++) {
  const connection = pool.acquire();
  console.log(connection);
}
