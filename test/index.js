let Promise = require("../dist/Promise_ES");
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(100);
    }, 1000);
})

p.finally(() => {
    console.log("finally");
}).then(data => {
    console.log("success", data);
}, err => {
    console.log("fail", err);
})


// Promise.resolve(200).then(data => console.log("success-", data), err => console.log("err-", err));