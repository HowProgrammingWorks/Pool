'use strict';

const pool = (factory) => {
  const instances = new Array(5).fill(null).map(() => factory.create());
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

class Connection {
  constructor(index) {
    this.url = `http://10.0.0.1/${index}`;
  }
}

class Factory {
  constructor() {
    this.index = 0;
  }

  create() {
    return new Connection(this.index++);
  }
}

/*

const alternativeFactory = (() => {
  let index = 0;
  return () => new Connection(`http://10.0.0.1/${index++}`);
})();

*/

// Usage

const connectionFactory = new Factory();
const connectionPool = pool(connectionFactory);
const connection = connectionPool();
console.log(connection);
