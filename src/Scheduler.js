const { Event, EnumEvent } = require('./Event');
const { rnd, generateRandomBetween1And0 } = require('./Math');

class Scheduler {
    constructor(queues, randomList) {
        this.scheduledEvents = [];
        this.queues = queues;
        this.currentQueue = 0;
        this.currentTime = 0;
        this.previousTime = 0;

        this.logSchedule = [];
        this.events = []; // events to be processed
        this.logEvents = []; // only for log in the end of simulation

        this.randomList = randomList;
    };

    setRandomList(randomList) {
        this.randomList = randomList;
    };

    generateRandomNumbersList(totalNumbers) {
        const randomNumbersList = [];
        let randomNumber = 0;

        for (let i = 0; i < totalNumbers; i++) {
            randomNumber = parseFloat(generateRandomBetween1And0()).toFixed(4);
            randomNumbersList.push(randomNumber);
        }

        return randomNumbersList;
    }

    shiftRandom() {
        return this.randomList.shift();
    }

    countTime() {
        const deltaTime = this.currentTime - this.previousTime;

        this.queues.forEach((queue) => {
            queue.timeAccount(deltaTime);
        })
    };

    queueHasCapacity() {
        const queue = this.queues[this.currentQueue];
        return !queue.capacity || queue.position < queue.capacity;
    }

    processArrival(event) {
        this.countTime();

        if (this.queueHasCapacity()) {
            this.queues[this.currentQueue].incrementPosition();

            const queue = this.queues[this.currentQueue];
            if (queue.position <= queue.size) {
                const { network = [] } = queue;

                if (network.length) {
                    let hadTransition = false;
                    for (let i = 0; i < network.length; i++) {
                        if (this.shiftRandom() < network[i].probability) {
                            //ALTERAR O MÉTODO DE PASSAGEM
                            this.schedulerPassage(network[i].queue);
                            hadTransition = true;
                            break;
                        }
                    }

                    if (!hadTransition) {
                        this.schedulerExit();
                    }
                } else {

                    if (this.queues[this.currentQueue + 1]) {
                        this.schedulerPassage();
                    } else {
                        this.schedulerExit();
                    }

                }
            }

        } else {
            this.queues[this.currentQueue].loss++;
        }

        this.schedulerArrival();

        this.logEvents.push(event);
    };

    processPassage(target, event) {
        this.countTime();

        if (this.queues[this.currentQueue].position > 0) {
            this.queues[this.currentQueue].decrementPosition();
        }

        const queue = this.queues[this.currentQueue];
        if (queue.position >= queue.size) {
            
            const { network = [] } = queue;
            if (network.length) {
                let hadTransition = false;

                for(let i = 0; i < network.length; i++) {
                    if (this.shiftRandom() < network[i].probability) {
                        this.schedulerPassage(network[i].queue);
                        hadTransition = true;
                        break;
                    }
                }

                if (!hadTransition) {
                    this.schedulerExit();
                }
            } else {
                this.schedulerPassage();
            }
        }

        const targetQueue = target || this.currentQueue + 1;

        if (!this.queues[targetQueue]) {
            return;
        }

        this.currentQueue = targetQueue;

        if (this.queueHasCapacity()) {
            this.queues[this.currentQueue].incrementPosition();

            if (this.queues[this.currentQueue].position <= 1) {
                this.schedulerExit();
            }
        } else {
            this.queues[this.currentQueue].loss++;
        }

        this.logEvents.push(event);
    };

    processExit(event) {
        this.countTime();

        const currentQueue = this.queues[this.currentQueue];

        if (currentQueue.position > 0) {
            currentQueue.decrementPosition();
        }

        if (currentQueue.position >= currentQueue.size) {
            const { network = [] } = currentQueue;

            if (network.length) {
                let hadTransition = false;
                for (let i = 0; i < network.length; i++) {
                    if (this.shiftRandom() < network[i].probability) {
                        this.schedulerPassage(network[i].queue);
                        hadTransition = true;
                        break;
                    }
                }

                if (!hadTransition) {
                    this.schedulerExit();
                }
            } else {
                this.schedulerExit();
            }
        }

        this.logEvents.push(event);
    };

    schedulerArrival(init) {
        const currentQueue = this.queues[this.currentQueue];
        const { arrivalMin, arrivalMax } = currentQueue;

        const tempoChegada =
            this.currentTime + (init || rnd(arrivalMin, arrivalMax, this.shiftRandom()));

        this.events.push(
            new Event(
                EnumEvent.ARRIVAL,
                tempoChegada,
                this.currentQueue
            )
        );
    };

    schedulerPassage(target) {
        const currentQueue = this.queues[this.currentQueue];
        const { awaitMin, awaitMax } = currentQueue;
        const tempoPassagem = this.currentTime + rnd(awaitMin, awaitMax, this.shiftRandom());

        this.events.push(
            new Event(
                EnumEvent.PASSAGE,
                tempoPassagem,
                this.currentQueue,
                target
            )
        )
    };

    schedulerExit() {
        const { awaitMin, awaitMax } = this.queues[this.currentQueue];

        const exitTime = this.currentTime + rnd(awaitMin, awaitMax, this.shiftRandom());

        this.events.push(
            new Event(EnumEvent.EXIT, exitTime, this.currentQueue)
        );
    };

    getSimulationData() {
        const allQueuesResults = []
        this.queues.map((value, index) => {
            allQueuesResults.push({
                logEvents: this.logEvents,
                statesTime: value.timeEachPosition,
                loss: value.loss,
                queue: value
            })
            //console.log('aaa ', value);
        });

        return allQueuesResults;
    };

    execute() {
        const event = this.events.sort((a, b) => a.time - b.time).shift();

        this.previousTime = this.currentTime;
        this.currentTime = event.time;
        this.currentQueue = event.queue;

        if (event.type === EnumEvent.ARRIVAL) {
            this.processArrival(event);
        } else if (event.type === EnumEvent.EXIT) {
            this.processExit(event);
        } else if (event.type === EnumEvent.PASSAGE) {
            this.processPassage(event.target, event);
        }
    };
}


module.exports = Scheduler;
