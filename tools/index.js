const { performance } = require('perf_hooks');

const randomInt = (max) => Math.floor(Math.random() * max);

const sleep = sec => {
  console.log(`sleeping ${sec} second(s)`);
  var start = new Date().getTime();
  var end = start;
  while (end < start + sec * 1000) {
    end = new Date().getTime();
  }
};

module.exports.makeSleep = fn => async (...args) => {
  console.log(`${fn.name} started`);
  // sleep(randomInt(3));
  sleep(1);
  console.log(`${fn.name} ended`);

  return fn(...args);
};

module.exports.run = async fn => {
  const start = performance.now();
  await fn;
  const end = performance.now();

  console.log(`duration: ${end - start} ms`);
}; 