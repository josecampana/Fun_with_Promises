const { makeSleep, run } = require('../tools');

const f1 = makeSleep(async function sum1(a) {
  return a + 1;
});

const f2 = makeSleep(async function mult2(b) {
  return b * 2;
});

const f3 = async () => {
  const res1 = await f1(4);
  const res2 = await f2(res1);

  return res2 + res1;
};

const main = async () => {
  const res = await f3();
  console.log(res);
};

run(main());
