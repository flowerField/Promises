/* 核心注解 */
/* 1、Promise应该被设计为一个类(构造函数) */
/* 2、Promise存在三种状态，分别是pending(等待)、rejected(失败) 和 resolved(成功)。*/
/* 3、Promise类(构造函数)接收一个“拥有两个函数参数的函数”作为参数，我们可以称之为执行器函数(executor),立即执行。 */
/* 4、Promise类(构造函数)内部应该以私有函数的方式来是实现reject和resolve函数。 */
/* 5、Promise内部考虑到异步任务的执行(譬如定时器)Promise状态无法立即完成等待->成功|失败的切换，因此使用注册/订阅模式 */
/* 6、Promise的then方法处理失败、成功、等待态(如果存在异步任务)的Promise后续任务。 */
/* 7、Promise的then方法应该实现链式调用，实现的策略是总是返回一个新的Promise对象 */

const PENDING = "PENDING";
const RESOLVED = "RESOLVED";
const REJECTED = "REJECTED";

function resolvePromise(promise, x, resolve, reject) {

    /* 1、死循环处理 */
    if (promise === x) {
        reject(new TypeError("# Chaining cycle detected for promise #<Promise>"))
    }

    let called = false;
    /* 2、区分返回值是基本值和(Promise)的情况*/
    if ((typeof x === "object" && x != null) || typeof x === "function") {
        try {
            let then = x.then;
            if (typeof then === "function") {
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise, y, resolve, reject); /* 递归调用 */
                }, r => {
                    if (called) return;
                    called = true;
                    reject(r);
                })
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

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = this.reason = undefined;
        this.rejectedCallBacks = [];
        this.resolvedCallBacks = [];

        /* reject 和 resolve 应该被实现为私有函数 */
        let resolve = (val) => {

            /* 如果情况如：resolve(new Promise(()=>{}))，则需要继续执行 */
            if (val instanceof Promise) {
                return val.then(resolve, reject);
            }

            if (this.status === PENDING) {
                this.status = RESOLVED;
                this.value = val;
                this.resolvedCallBacks.forEach(fn => fn());
            }
        }

        let reject = (val) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = val;
                this.rejectedCallBacks.forEach(fn => fn());
            }
        }

        /* 执行器函数应该立即执行，并进行异常处理 */
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : v => v;
        onRejected = typeof onRejected === "function" ? onRejected : e => { throw e }

        let promise = new Promise((resolve, reject) => {
            if (this.status === RESOLVED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);

            }

            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }

            if (this.status === PENDING) {
                this.rejectedCallBacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                })

                this.resolvedCallBacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                })
            }
        })
        return promise;
    }
    catch (errCallBack) {
        return this.then(null, errCallBack);
    }
    static resolve(val) {
        return new Promise((resolve, reject) => {
            resolve(val);
        })
    }
    static reject(err) {
        return new Promise((resolve, reject) => {
            reject(err);
        })
    }
    static all(promises) {
        // 需要等所有的promises都执行完毕才整个的执行完毕
        return new Promise((resolve, reject) => {

            let idx = 0;
            let arr = [];

            function process(key, data) {
                idx++;
                arr[key] = data;
                if (idx === promises.length) {
                    resolve(arr);
                }
            }

            promises.forEach((current, idx) => {
                if (typeof current.then == "function") {
                    current.then((data) => {
                        process(idx, data);
                    }, err => {
                        reject(err);
                    })
                } else {
                    process(idx, current);
                }
            })
        })
    }
    finally(callBack) {
        return this.then(
            (value) => {
                return Promise.resolve(callBack()).then(() => value);
            }, (reason) => {
                return Promise.resolve(callBack()).then(() => { throw reason });
            })
    }

}

/* 基准测试 */
Promise.defer = Promise.deferred = function() {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}

module.exports = Promise;