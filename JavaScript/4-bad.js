'use strict';

const poolify = (factory, size, max) => {
  const instances = new Array(size).fill(null).map(factory);
  const queue = [];
  let available = instances.length;

  const processQueue = () => {
    while (queue.length > 0 && available > 0){
      const { resolve } = queue.shift();
      resolve(instances.pop());
      available--;
    }
  };

  const acquire = () => {
    return new Promise((resolve) => {
      if(available > 0){
        const instance = instances.pop();
        available--;
        resolve(instance);
      }
      else {
        queue.push({ resolve });
      }
    });
  };

  const release = (instance) => {
    if (instances.length < max) {
      instances.push(instance);
      available++;
      processQueue();
    }
  };

  return { acquire, release };
};

// Usage

const createBuffer = (size) => new Uint8Array(size);

const bufferSize = 4096;
const createFileBuffer = () => createBuffer(bufferSize);

const size = 2;
const max = 4;
const pool = poolify(createFileBuffer, size, max);

(async () => {
  const instance1 = await pool.acquire();
  console.log('Acquired instance 1', instance1);
  setTimeout(() => {
    console.log('Releasing instance 1');
    pool.release(instance1);
  }, 1000);

  const instance2 = await pool.acquire();
  console.log('Acquired instance 2', instance2);
  setTimeout(() => {
    console.log('Releasing instance 2');
    pool.release(instance2);
  }, 1500);

  const instance3 = await pool.acquire();
  console.log('Acquired instance 3', instance3);
  setTimeout(() => {
    console.log('Releasing instance 3');
    pool.release(instance3);
  }, 1000);

  const instance4 = await pool.acquire();
  console.log('Acquired instance 4', instance4);
  setTimeout(() => {
    console.log('Releasing instance 4');
    pool.release(instance4);
  }, 1500);
})();