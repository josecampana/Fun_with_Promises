const { makeSleep, run } = require('../tools');

const f1 = makeSleep(async function sum1(a) {
  return a + 1;
});

const f2 = makeSleep(async function mult2(b) {
  return b * 2;
});

const f3 = async () => {
  const results = await Promise.all([f1(5), f2(2)]); //it could be done more fancy by deconstructing
  return results[0] + results[1];
};

const main = async () => {
  const res = await f3();
  console.log(res);
};

run(main());
