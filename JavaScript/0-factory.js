'use strict';

const poolify = (factory) => {
  const instances = new Array(5).fill(null).map(() => factory.create());

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

class Connection {
  constructor(index) {
    this.url = `http://10.0.0.1/${index}`;
  }
}

class ConnectionFactory {
  constructor() {
    this.index = 0;
  }

  create() {
    return new Connection(this.index++);
  }
}

// Usage

const factory = new ConnectionFactory();
const pool = poolify(factory);
const connection = pool.acquire();
console.log(connection);
pool.release(connection);
