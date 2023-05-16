let Promise = require("./myPromise");

new Promise(() => { throw new Error('错误') }).catch(err => console.log(err));