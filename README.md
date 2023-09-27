# Fun with Promises

- [Promises the classic way](#promises-the-classic-way)
- [Promises, the new way: async/await pattern ](#promises-the-new-way-asyncawait-pattern)
- [Running promises in serial](#running-promises-in-serial)
  - [Chaining promises](#chaining-promises)
- [Running promises in parallel (Promise.all)](#running-promises-in-parallel-promiseall)
- [Managing errors](#managing-errors)
  - [try-catch](#try-catch)
  - [.catch() - part i](#catch---part-i)
  - [.catch() - part i](#catch---part-ii)
  - [try-catch + .catch()](#mixing-it-all)
- [Loopings...](#loopings)

![](./img/title.png)

In spanish from southern Spain (Andalucía), "ahora después" (literally "now after") is a fuzzy unit time. The meaing of this unit is something in between these two sentences:

- I'll finish it in a few seconds
- You could wait for some years for it

So a **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** is _something_ (it is an object) it will finish "ahora después" (you don't know when) **but it will finish** (in a good or a bad way).

So, **promises** are a great mechanism to perform **asynchronous operations** (async from now):

- calling an external API
- calling a database
- reading a file

## Promises, the classic way

- Create a new promise object and return it
- You need pass a function with the code that will be evaluated when creating the promise.
- Inside this function, use the resolve function to return the OK result, and the reject to return the KO result (the error)

```javascript
const a = new Promise((resolve, reject) => {
  //do async task...

  if(error){
    return reject(error);
  }

  return resolve(valueOK)
});

a.then(result => {
  console.log(result);
})
```

[Go to content index](#fun-with-promises)

## Promises, the new way: async/await pattern 

When I must to use async-await instead "Classic Promise" pattern? ==> **ALWAYS**. 
Why? Code with async/await is readable.

### Classic
```javascript
function fn(){
  return new Promise(function(resolve, error){
    fn2().then(function(result){
      console.log(result);
      return resolve(result);
    })
  });
};

//ES6
const fn = () => new Promise((resolve,error) => 
  fn2().then(result=>{
    console.log(result);

    resolve(result);
  })
);
```

### Async-Await
```javascript
async function fn(){
  const result = await fn2(); //fn2 is an async function

  console.log(result);
  return result;
}

//async-await ES6
const fn = async() => {
  const result = await fn2(); //fn2 is an async function

  console.log(result);
}
```

Key points to keep in mind:

- an _async_ function always return a _Promise_
- the _await_ could be used **only** inside an _async_ function
- the _await_ does not stop the execution for real but it will wait to jump to next line of the function until the _Promise_ you are waiting for is finished.

[Go to content index](#fun-with-promises)

## Running promises in serial

You run promises in serial when you need something from the response of the promise 1 to call the promise 2.

```javascript
const f1 = async a => a + 1;
const f2 = async a => a + 5;

const f3 = async a => {
  const res1 = await f1(a);
  const res2 = await f2(res1);

  return res2;
}

//as we are just returning res2, we don't really need to put the result into a variable and then return it, you could return directly the execution of the function:
const f3 = async a => {
  const res1 = await f1(a);

  return f2(res1);
}
```

[Go to content index](#fun-with-promises)

### Chaining promises

You could use **.then()** to chain promises (serial):

```javascript
const f1 = async a => a + 1;
const f2 = async a => a + 5;

const f3 = async a => {
  const res = await f1(a).then(f2);

  console.log(res);

  return res;
}

//without the console.log()...
const f3 = async a => f1(a).then(f2);
```

[Go to content index](#fun-with-promises)

## Running promises in parallel (Promise.all)

When you don't need the result of promise 1 to execute promise 2 (you do not have a dependency from previous promise).



```javascript
const getPrice = async id => fetch(`/price/${id}`);
const getDetail= async id => fetch(`/detail/${id}`);

const getDetailsWithPrice = async id => {
  const promises = [getPrice(id), getDetail(id)];
  const results = await Promise.all(promises);

  const price = results[0];
  const details = results[1];

  return {...details, price};
};
```

My real code ([**destructuring**](#more)):
```javascript
const getPrice = async id => fetch(`/price/${id}`);
const getDetail= async id => fetch(`/detail/${id}`);

const getDetailsWithPrice = async id => {
  const [details, price] = await Promise.all([getPrice(id), getDetail(id)])

  return { ...details, price };
};
```

[Go to content index](#fun-with-promises)

## Managing errors

You could use `.catch()` in your promise, add a `try-catch` block or even **combine both**. 

But you need to take care about what to use if you are using `await` or just returning the promise to understand what will happen in your code in case of error: [welcome to the jungle...](https://music.youtube.com/watch?v=0CNPR2qNzxk&si=Y00wW-DMRhBsWwxN)

The best way to understand it is with some examples. 

### try-catch

```javascript
const f1 = async () => {
  try {
    const res = await f2();
    return res;
  } catch (error) {
    console.error('catch at f1');
  }
};

const main = async () => {
  try {
    const res = await f1();
    console.log(res);
  } catch (error) {
    console.error('catch at main');
  }
};
```

The result of executing this (in case of error) is:

```bash
catch at f1 
undefined
```

The `undefined` is printed by `console.log(res);` at _main_ function because we are retuning nothing in our catch block...

Let's check another version. As doing `const res = await f2(); return res;` has no sense (we are doing nothing with _res_ just returning it), let's change it and just return f2's promise with `return f2();`

```javascript
const f1 = async () => {
  try {
    return f2();
  } catch (error) {
    console.error('catch at f1', error);
  }
};

const main = async () => {
  try {
    return f1();
  } catch (error) {
    console.error('catch at main', error);
  }
};
```

Do will have the same result when executing main? Let's see:

```bash
catch at main
```
:warning: the catch is at different point and we are not printing the `undefined`.

- We are not printing the `undefined` message because the `console.log` is inside the `try` block after calling f1...
- Why was the catch at a different point? Easy.

In the first example, we were waiting to the promise to be resolved by doing this: `const res = await f2();` so, the `try-catch` block inside f1 is able to capture the exception (the error) when the promise of f2 is resolved as rejected (error).

In the second example, as we are no waiting for the promise resolution inside f1, the `try-catch` block inside f1 could not capture the exception so the _main_ block does.

By the way, _f2_ was
```javascript
const f2 = () => Promise.reject('fistro');
```

or
```javascript
const f2 = async () => { 
  throw new Error('fistro');
};
```

booth are equivalent functions.

[Go to content index](#fun-with-promises)

### .catch() - part i

This is the mechanism promises has to manage rejections (`try-catch` blocks captures all kind of exceptions).

```javascript
const f1 = async () => {
  try{
    return f2().catch(error => {
      console.error('catch at f2');
    });
  }catch(error){
    console.error('catch at try-catch f2');
  }
};

const main = async () => {
  try {
    const res = await f1();
    console.log(res);
  } catch (error) {
    console.error('catch at main');
  }
};
```

Big surprise when executing _main_:

```bash
catch at f2
undefined
```

> _Oh wait, you said in the previous example that if you want the catch the exception (error) at f2 `try-catch` block you need to wait for the promise resolution, but you didn't put an `await` clausule in this example!_

You are right, you do not need to wait here because the `.catch` is part of the **"Promise chain"**. 

In this example, the `try-catch` block inside f1 **will never be executed** (except if you do mess inside `.catch()`)

[Go to content index](#fun-with-promises)

### .catch() - part ii

Let's see another example. In that case, we want to "manipulate" the results in case of error to allow the function to finish as a _Promise.resolve_

```javascript
const f1 = async () => {
  try {
    return f2().catch(error => {
      console.error('catch at f1');
      return 0;
    });
  } catch (error) {
    console.error('catch at try-catch f1');
  }
};

const main = async () => {
  try {
    const res = await f1();
    console.log(res);
  } catch (error) {
    console.error('catch at main');
  }
};
```

The result now is:

```bash
catch at f1
0
```

It was captured by `.catch()` at f2, forced to resolve as ok sending a 0 => main's `console.log` is printing the result in the `try` block. 

Again, the `try-catch` block inside f1 is not useful

Let's do something more interesting with the example by chaining promises...

```javascript
//in other languages n/0 throws and exception "Division by zero".
//in javascript it returns Infinity
const f3 = async a => {
  if (!a) {
    throw new Error('Division by zero');
  }

  return 100 / a;
};

const f1 = async () => {
  try {
    return f2().catch(_error => {
      console.error('catch at f1');

      return 0;
    }).then(f3);
  } catch (error) {
    console.error('catch at try-catch f1');
  }
};

const main = async () => {
  try {
    const res = await f1();
    console.log(res);
  } catch (error) {
    console.error('catch at main');
  }
};
```

and the result of running _main_:

```bash
catch at f1
catch at main
```

[Go to content index](#fun-with-promises)

### Conclusions about previous .catch() examples

- definitely the `try-catch` block at _f1_ has no sense because we are no waiting for the promise resolution
- sometimes, the `try-catch` block could be hard to manage the error into a promise chain or even inside a serialized execution with `await`.
- .catch() helps you to resolve more localized errors in your promise resolutions

### Mixing it all

Now we are going to mix `try-catch` (using `await` of course, we have no choice) with `.catch()` in a single example. [Let's rock](https://music.youtube.com/watch?v=WnJFQEHsSrU&si=CHlQt9Ncs-jH-H3h): 

```javascript
//in other languages n / 0 throws and exception "Division by zero".
//in javascript it returns Infinity
const f3 = async a => {
  if (!a) {
    throw new Error('Division by zero');
  }

  return 100 / a;
};

const DEFAULT_VALUE = 0;

const f1 = async () => {

  try {
    const result = await f2().catch(_error => {
      console.error('catch at f1');

      return DEFAULT_VALUE;
    }).then(f3).catch(_error => {
      console.error('catch at f1 (2)');
      return NaN;
    });

    console.log('result is:', result);

    return result.map(item => item.result + 1);
  } catch (error) {
    console.error('catch at try-catch f1');

    if (error.code === 'NOT_FOUND') {
      return 0;
    }

    throw error;
  }
};

const main = async () => {
  try {
    const res = await f1();
    console.log(res);
  } catch (error) {
    console.error('catch at main');
  }
};
```

When runing main the logs are:

```bash
catch at f1
catch at f1 (2)
result is: NaN
catch at try-catch f1
TypeError: result.map is not a function
```

![](./img/bender.png) So yes, **do not use exclusively `.catch()`** because the **error could be in other part of your code**.

[Go to content index](#fun-with-promises)

## Loopings...

We are going to use [the map function over arrays](#array-trilogy) to loop our promises.

Example: reuse previous code and allow to get a list of product ids.

```javascript
const getPrice = async id => fetch(`/price/${id}`);
const getDetail= async id => fetch(`/detail/${id}`);

const getDetailsWithPrice = async id => {
  const [details, price] = await Promise.all([getPrice(id), getDetail(id)])

  return { ...details, price };
};

const getProductListDetails = async list => {
  return Promise.all(list.map(id => getDetailsWithPrice(id)))
}

//more ES6
const getProductListDetailsES6 = async list => Promise.all(list.map(id => getDetailsWithPrice(id)));
```

[Go to content index](#fun-with-promises)

## Links of interest

- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Promise.all](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [Arrays](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [PromiseJS.org](https://www.promisejs.org/)
- **[MDN Javascript Reference](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference)**