![](./img/title.png)

[Go to exercises](./exercises/README.md)

# Fun with Promises

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

## Links of interest

- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Promise.all](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [Arrays](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array)

### Array trilogy
- [array map](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [array filter](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [array reduce](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

### More
- [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- **[MDN Javascript Reference](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference)**

## Exercises

[Go to exercises](./exercises/README.md)