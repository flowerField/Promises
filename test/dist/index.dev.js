"use strict";

var Promise = require("../dist/Promise_ES"); // let p = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject(100);
//     }, 1000);
// })
// p.finally(() => {
//     console.log("finally");
// }).then(data => {
//     console.log("success", data);
// }, err => {
//     console.log("fail", err);
// })
// Promise.resolve(200).then(data => console.log("success-", data), err => console.log("err-", err));

/* All方法测试 */


var p1 = 200;
var p2 = new Promise(function (resolve, reject) {
  console.log("start-p2");
  setTimeout(function () {
    console.log("task-p2");
    reject(100);
  }, 2000);
  console.log("end-p2");
});
var p3 = new Promise(function (resolve, reject) {
  console.log("start-p3");
  setTimeout(function () {
    console.log("task-p3");
    resolve(300);
  }, 1000);
  console.log("end-p3");
});
Promise.all([p1, p2, p3]).then(function (data) {
  console.log("all-success", data);
})["catch"](function (err) {
  console.log("all-error", err);
});
/* start-p2 */

/* end-p2 */

/* start-p3 */

/* end-p3 */

/* task-p3 */

/* task-p2 */