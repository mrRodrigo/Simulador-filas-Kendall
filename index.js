const Scheduler = require('./src/Scheduler');
const Queue = require('./src/Queue');
const Logger = require('./src/Logger');
const processCommands = require('./processCommands');

const [,, configFile, ...options ] =  process.argv;
//const QueueConfiguration = require(`./inputs/${configFile}.json`);

//Usar essa linha para debugar. Informe o nome do arquivo desejado.
const QueueConfiguration = require(`./inputs/TandemQueue.json`);

const executeParams = processCommands(options);

const executeNTimes = ({ verbose, run }) => {
    const allResults = [];

    Array.from({ length: run }, () => allResults.push(execute()));

    Logger.showAverageData(allResults, verbose);
};

const executeOnce = ({ verbose }) => {

    const result = execute();

    console.log('resultadinho: ', result);

    result.queues.map((value) => {
        Logger.showSimulationData(value, verbose);
    });

        //Logger.showSimulationData(result, verbose);
};

const execute = () => {

    const arrayOfRawData = QueueConfiguration.queues;
    const listOfQueues = [];

    arrayOfRawData.map((queue) => {
        listOfQueues.push(new Queue(queue));
    });

    //const queue = new Queue(QueueConfiguration.queues);
    const scheduler = new Scheduler(listOfQueues, []);

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
