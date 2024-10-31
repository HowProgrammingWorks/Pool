'use strict';

const pool = (factory) => {
  const instances = new Array(5).fill(null).map(factory);
  return (instance) => {
    if (instance) {
      instances.push(instance);
      console.log('Recycle item, count =', instances.length);
      return null;
    }
    const result = instances.pop() || factory();
    console.log('Get from pool, count =', instances.length);
    return result;
  };
};

// Usage

class Connection {
  static index = 0;

  constructor(url) {
    this.url = url;
  }

  static create() {
    return new Connection(`http://10.0.0.1/${Connection.index++}`);
  }
}

const connectionPool = pool(Connection.create);

for (let i = 0; i < 10; i++) {
  const connection = connectionPool();
  console.log(connection);
}
