const { makeSleep, run } = require('../tools');

const f1 = makeSleep(async function sum1(a) {
  return a + 1;
});

const f2 = makeSleep(async function mult2(b) {
  return b * 2;
});

// create f3 here!


const main = async () => {
  // const res = f3();
  console.log(res);
};

run(main());
