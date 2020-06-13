"use strict";

var Promise = require("../dist/Promise_ES");

var p = new Promise(function (resolve, reject) {
  setTimeout(function () {
    reject(100);
  }, 1000);
});
p["finally"](function () {
  console.log("finally");
}).then(function (data) {
  console.log("success", data);
}, function (err) {
  console.log("fail", err);
}); // Promise.resolve(200).then(data => console.log("success-", data), err => console.log("err-", err));