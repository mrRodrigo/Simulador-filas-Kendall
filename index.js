const Scheduler = require('./src/Scheduler');
const Queue = require('./src/Queue');
const Logger = require('./src/Logger');

const QueueConfiguration = require(`./inputs/${process.argv[2]}.json`);

const queue = new Queue(QueueConfiguration.queues);
const scheduler = new Scheduler(queue, []);

if (QueueConfiguration.randomList.length === 0) {
    scheduler.setRandomList(scheduler.generateRandomNumbersList(QueueConfiguration.totalRandomNumbers));
} else {
    scheduler.setRandomList(QueueConfiguration.randomList);
}

scheduler.schedulerArrival(queue.init);

while (scheduler.randomList.length > 0) {
    scheduler.execute();
}

Logger.showSimulationData(scheduler.getSimulationData());
