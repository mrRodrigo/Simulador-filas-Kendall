const Scheduler = require('./src/Scheduler');
const Queue = require('./src/Queue');
const Logger = require('./src/Logger');
const processCommands = require('./processCommands');
const SchedulerSimpleQueue = require('./src/SchedulerSimpleQueue');

const [,, configFile, ...options ] =  process.argv;
const QueueConfiguration = require(`./inputs/${configFile}.json`);

//Usar essa linha para debugar. Informe o nome do arquivo desejado.
//const QueueConfiguration = require(`./inputs/TandemQueue.json`);

const executeParams = processCommands(options);

const executeNTimes = ({ verbose, run }) => {
    const allResults = [];

    Array.from({ length: run }, () => allResults.push(execute()));

    Logger.showAverageData(allResults, verbose);
};

const executeOnce = ({ verbose }) => {

    const allQueuesResults = execute();

    //console.log('all queues result: ', allQueuesResults);

    if(!Array.isArray(allQueuesResults)) {
        Logger.showSimulationData(allQueuesResults, false);
        console.log('Loss: ', allQueuesResults.loss);
    } else {

        allQueuesResults.map((result) => {
        Logger.showSimulationData(result, verbose);
    })
        console.log('Loss: ', allQueuesResults[0].loss);
    }

    //console.log('aaa ', allQueuesResults);

    //Logger.showSimulationData(result, false);
    //Logger.showSimulationData(result, verbose);
};

const execute = () => {

    const arrayOfRawData = QueueConfiguration.queues;
    const listOfQueues = [];
    let scheduler;

    arrayOfRawData.map((queue) => {
        listOfQueues.push(new Queue(queue));
    });

    if (listOfQueues.length == 1) {
        scheduler = new SchedulerSimpleQueue(listOfQueues[0], []);
    } else {
        //const queue = new Queue(QueueConfiguration.queues);
        scheduler = new Scheduler(listOfQueues, []);
    }

    if (QueueConfiguration.randomList.length === 0) {
        scheduler.setRandomList(scheduler.generateRandomNumbersList(QueueConfiguration.totalRandomNumbers));
    } else {
        scheduler.setRandomList(QueueConfiguration.randomList);
    }

    //o tempo inicial sempre estará na primeira fila (posicao [0])
    scheduler.schedulerArrival(listOfQueues[0].init);

    while (scheduler.randomList.length > 0) {
        scheduler.execute();
    }

    return scheduler.getSimulationData();
};

executeParams.run ? executeNTimes(executeParams) : executeOnce(executeParams)
