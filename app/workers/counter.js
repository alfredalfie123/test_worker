const { Observable } = require("observable-fns");
const { expose } = require("threads/worker");

function startCounting() {
  return new Observable(observer => {
    observer.next(1);
    // for (let currentCount = 1; currentCount <= 10; currentCount++) {
    //   observer.next(currentCount);
    // }
    observer.complete();
  })
}

expose(startCounting);