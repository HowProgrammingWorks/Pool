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

const pool = () => {
  const instances = new Array(5).fill(null).map(Connection.create);
  return (instance) => {
    if (instance) {
      instances.push(instance);
      console.log('Recycle item, count =', instances.length);
      return null;
    }
    const result = instances.pop();
    console.log('Get from pool, count =', instances.length);
    return result;
  };
};

// Usage

const connectionPool = pool(Connection.create);

for (let i = 0; i < 7; i++) {
  const connection = connectionPool();
  console.log(connection);
}
