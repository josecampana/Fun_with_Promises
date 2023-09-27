const asyncFunction = () => Promise.reject('error');

const f1 = async () => {
  try {
    return asyncFunction();
  } catch (error) {
    return 0;
  }

};

const f2 = async () => {
  try {
    return await asyncFunction();
  } catch (error) {
    return 0;
  }
};

const main = async () => {
  console.log('f1 result: ', await f1().catch(() => 1));
  console.log('f2 result: ', await f2().catch(() => 1));
};

main();