const Scheduler = require('./src/Scheduler');
const Queue = require('./src/Queue');

const queueConfig = {
    size: 1,
    capacity: 3,
    arrivalMin: 1,
    arrivalMax: 2,
    awaitMin: 3,
    awaitMax: 6,
    init: 2
}
const randomList = [0.3276, 0.8851, 0.1643, 0.5542, 0.6813, 0.7221, 0.9881];

const queue = new Queue(queueConfig);
const scheduler = new Scheduler(queue, randomList);

scheduler.schedulerArrival(queue.init);

while (scheduler.randomList.length > 0) {
    scheduler.execute();
}
