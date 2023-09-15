const { makeSleep, run } = require('../tools');

const f1 = makeSleep(async function sum1(a) {
  return a + 1;
});

const f2 = makeSleep(async function mult2(b) {
  return b * 2;
});

const f3 = async () => {
  //get the result of f1 with 4 and send it to f2. Return the value of f2
  return f1(4).then(f2);
};

const main = async () => {
  const res = await f3();
  console.log(res);
};


run(main());
