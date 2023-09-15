const { makeSleep, run } = require('../tools');

const f1 = makeSleep(async function sum1(a) {
  return a + 1;
});

const f2 = makeSleep(async function mult2(b) {
  return b * 2;
});

const f3 = async () => {
  //call f1 with 4
  //call f2, with the result of f1
  //return f1 + f2
};

const main = async () => {
  const res = f3();
  console.log(res);
};

run(main());
