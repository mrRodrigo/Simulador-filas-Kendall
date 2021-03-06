const Scheduler = require('./src/Scheduler');
const Queue = require('./src/Queue');
const Logger = require('./src/Logger');
const processCommands = require('./processCommands');

const [,, configFile, ...options ] =  process.argv;
const QueueConfiguration = require(`./inputs/${configFile}.json`);

const executeParams = processCommands(options);

const executeNTimes = ({ verbose, run }) => {
    const allResults = [];

    Array.from({ length: run }, () => allResults.push(execute()));

    Logger.showAverageData(allResults, verbose);
};

const executeOnce = ({ verbose }) => {
    const result = execute();
        Logger.showSimulationData(result, verbose);
};

const execute = () => {
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

    return scheduler.getSimulationData();
};

executeParams.run ? executeNTimes(executeParams) : executeOnce(executeParams)
