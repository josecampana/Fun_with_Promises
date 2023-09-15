const { makeSleep, run } = require('../tools');

const f1 = makeSleep(async function sum1(a) {
  return a + 1;
});

const f2 = makeSleep(async function mult2(b) {
  return b * 2;
});

const f3 = async () => {
  //call f1 with 5
  //call f2 with 2
  //return f1 + f2 
  const res1 = await f1(5);
  const res2 = await f2(2);

  return res2 + res1;
};

const f3Alt = async () => {
  const results = await Promise.all([f1(5), f2(2)]); //it could be done more fancy by deconstructing
  return results[0] + results[1];
};


const main = async () => {
  const res = await f3();
  console.log(res);
};

const mainAlt = async () => {
  const res = await f3Alt();
  console.log(res);
};

run(main());
// run(mainAlt());