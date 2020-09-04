const Scheduler = require('./src/Scheduler');
const Queue = require('./src/Queue');
const Logger = require('./src/Logger');

const queueConfig = {
    size: 1,
    capacity: 3,
    arrivalMin: 1,
    arrivalMax: 2,
    awaitMin: 3,
    awaitMax: 6,
    init: 2
}

const queue = new Queue(queueConfig);
const scheduler = new Scheduler(queue, []);

const randomNumberList = scheduler.generateRandomNumbersList(100);

scheduler.setRandomList(randomNumberList);

scheduler.schedulerArrival(queue.init);

while (scheduler.randomList.length > 0) {
    scheduler.execute();
}

Logger.showSimulationData(scheduler.getSimulationData());
