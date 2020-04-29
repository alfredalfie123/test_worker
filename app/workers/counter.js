const { Observable } = require("observable-fns");
const { expose } = require("threads/worker");

function startCounting() {
  return new Observable(observer => {
    for (let currentCount = 1; currentCount <= 10; currentCount++) {
      observer.next(currentCount);
    }
    observer.complete();
  })
}

expose(startCounting);