"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* 核心注解 */

/* 1、Promise应该被设计为一个类(构造函数) */

/* 2、Promise存在三种状态，分别是pending(等待)、rejected(失败) 和 resolved(成功)。*/

/* 3、Promise类(构造函数)接收一个“拥有两个函数参数的函数”作为参数，我们可以称之为执行器函数(executor),立即执行。 */

/* 4、Promise类(构造函数)内部应该以私有函数的方式来是实现reject和resolve函数。 */

/* 5、Promise内部考虑到异步任务的执行(譬如定时器)Promise状态无法立即完成等待->成功|失败的切换，因此使用注册/订阅模式 */

/* 6、Promise的then方法处理失败、成功、等待态(如果存在异步任务)的Promise后续任务。 */

/* 7、Promise的then方法应该实现链式调用，实现的策略是总是返回一个新的Promise对象 */
var PENDING = "PENDING";
var RESOLVED = "RESOLVED";
var REJECTED = "REJECTED";

function resolvePromise(promise, x, resolve, reject) {
  /* 1、死循环处理 */
  if (promise === x) {
    reject(new TypeError("# Chaining cycle detected for promise #<Promise>"));
  }

  var called = false;
  /* 2、区分返回值是基本值和(Promise)的情况*/

  if (_typeof(x) === "object" && x != null || typeof x === "function") {
    try {
      var then = x.then;

      if (typeof then === "function") {
        then.call(x, function (y) {
          if (called) return;
          called = true;
          resolvePromise(promise, y, resolve, reject);
          /* 递归调用 */
        }, function (r) {
          if (called) return;
          called = true;
          reject(r);
        });
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

var Promise =
/*#__PURE__*/
function () {
  function Promise(executor) {
    var _this = this;

    _classCallCheck(this, Promise);

    this.status = PENDING;
    this.value = this.reason = undefined;
    this.rejectedCallBacks = [];
    this.resolvedCallBacks = [];
    /* reject 和 resolve 应该被实现为私有函数 */

    var resolve = function resolve(val) {
      /* 如果情况如：resolve(new Promise(()=>{}))，则需要继续执行 */
      if (val instanceof Promise) {
        return val.then(resolve, reject);
      }

      if (_this.status === PENDING) {
        _this.status = RESOLVED;
        _this.value = val;

        _this.resolvedCallBacks.forEach(function (fn) {
          return fn();
        });
      }
    };

    var reject = function reject(val) {
      if (_this.status === PENDING) {
        _this.status = REJECTED;
        _this.reason = val;

        _this.rejectedCallBacks.forEach(function (fn) {
          return fn();
        });
      }
    };
    /* 执行器函数应该立即执行，并进行异常处理 */


    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  _createClass(Promise, [{
    key: "then",
    value: function then(onFulfilled, onRejected) {
      var _this2 = this;

      onFulfilled = typeof onFulfilled === "function" ? onFulfilled : function (v) {
        return v;
      };
      onRejected = typeof onRejected === "function" ? onRejected : function (e) {
        throw e;
      };
      var promise = new Promise(function (resolve, reject) {
        if (_this2.status === RESOLVED) {
          setTimeout(function () {
            try {
              var x = onFulfilled(_this2.value);
              resolvePromise(promise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        }

        if (_this2.status === REJECTED) {
          setTimeout(function () {
            try {
              var x = onRejected(_this2.reason);
              resolvePromise(promise, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        }

        if (_this2.status === PENDING) {
          _this2.rejectedCallBacks.push(function () {
            setTimeout(function () {
              try {
                var x = onRejected(_this2.reason);
                resolvePromise(promise, x, resolve, reject);
              } catch (e) {
                reject(e);
              }
            }, 0);
          });

          _this2.resolvedCallBacks.push(function () {
            setTimeout(function () {
              try {
                var x = onFulfilled(_this2.value);
                resolvePromise(promise, x, resolve, reject);
              } catch (e) {
                reject(e);
              }
            }, 0);
          });
        }
      });
      return promise;
    }
  }, {
    key: "catch",
    value: function _catch(errCallBack) {
      return this.then(null, errCallBack);
    }
  }, {
    key: "finally",
    value: function _finally(callBack) {
      return this.then(function (value) {
        return Promise.resolve(callBack()).then(function () {
          return value;
        });
      }, function (reason) {
        return Promise.resolve(callBack()).then(function () {
          throw reason;
        });
      });
    }
  }], [{
    key: "resolve",
    value: function resolve(val) {
      return new Promise(function (resolve, reject) {
        resolve(val);
      });
    }
  }, {
    key: "reject",
    value: function reject(err) {
      return new Promise(function (resolve, reject) {
        reject(err);
      });
    }
  }]);

  return Promise;
}();
/* 基准测试 */


Promise.defer = Promise.deferred = function () {
  var dfd = {};
  dfd.promise = new Promise(function (resolve, reject) {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

module.exports = Promise;