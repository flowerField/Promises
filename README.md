# Promises
Achieving the PromiseA+ specification

<img src="./src/promise.png">

> 上面是ES6+实现的Promise核心方法，其整体结构也可以通过下面的打印查看

```javascript
  /* 01-打印Promise类的内容(静态方法) */
  console.dir(Promise)

  /* 打印输出(已经省略部分内容) */
  // length: 1                      期望形参数量((resolve,reject)=>{})
  // name: "Promise"                类(构造函数)的名字
  // prototype: Promise             原型对象
  //    then: ƒ then()              then处理函数
  //    catch: ƒ catch()            catch处理函数
  //    finally: ƒ finally()        完成的处理函数
  //    constructor: ƒ Promise()    原型的构造器属性
  // race: ƒ race()                 异步任务并发先执行完
  // reject: ƒ reject()             包装为reject     
  // resolve: ƒ resolve()           包装为resolve
  // all: ƒ all()                   异步任务并发都执行完
  // allSettled: ƒ allSettled()
  // Symbol(Symbol.species): (...)
  // Symbol(Symbol.toStringTag): "Promise"
```
