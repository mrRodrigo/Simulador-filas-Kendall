const { Event, EnumEvent } = require('./Event');
const { rnd } = require('./Random');

class Scheduler {
    constructor(queue, randomList) {
        this.queue = queue;
        this.currentTime = 0;
        this.previousTime = 0;
        this.loss = 0;
        this.events = []; // events to be processed
        this.logEvents = []; // only for log in the end of simulation
        this.statesTime = {}; // all time for each states
        this.randomList = this.setRandomList(randomList);
    };

    setRandomList(randomList){
        return randomList ? randomList : this.generateRandomList();
    };

    generateRandomList() {
        // TO DO
        return [0.3276, 0.8851, 0.1643, 0.5542, 0.6813, 0.7221, 0.9881];
    };

    shiftRandom(){
        return this.randomList.shift();
    }

    countTime() {
        const deltaTime = this.currentTime - this.previousTime;
        this.statesTime[this.queue.position] =
            (Number(this.statesTime[this.queue.position]) || 0) + deltaTime;
    };

    processArrival(event) {
        this.countTime();

        if (this.queue.position < this.queue.capacity) {
            this.queue.incrementPosition();
            if (this.queue.position <= this.queue.size) this.schedulerExit();
        } else this.loss++;

        this.schedulerArrival();

        this.logEvents.push(event);
    };

    schedulerArrival(init) {
        const { arrivalMin, arrivalMax } = this.queue;

        const tempoChegada =
            this.currentTime + (init || rnd(arrivalMin, arrivalMax, this.shiftRandom()));

        this.events.push(
            new Event(
                EnumEvent.ARRIVAL,
                tempoChegada,
                this.queue.position
            )
        );
    };

    processExit(event) {
        this.countTime();

        this.queue.decrementPosition();

        if (this.queue.position >= this.queue.size) this.schedulerExit();

        this.logEvents.push(event);
    };

    schedulerExit() {
        const { awaitMin, awaitMax } = this.queue;

        const tempoSaida = this.currentTime + rnd(awaitMin, awaitMax, this.shiftRandom());

        this.events.push(
            new Event(
                EnumEvent.EXIT,
                tempoSaida,
                this.queue.position
            )
        );
    };

    getSimulationData(){
        return {
            loss: this.loss,
            logEvents: this.logEvents,
            statesTime: this.statesTime,
            queue: this.queue,
        };
    };

    execute() {
        const event = this.events.sort((a, b) => a.time - b.time).shift();

        this.previousTime = this.currentTime;
        this.currentTime = event.time;

        if (event.type === EnumEvent.ARRIVAL) {
            this.processArrival(event);
        } else if (event.type === EnumEvent.EXIT) {
            this.processExit(event);
        }
    };
}


module.exports = Scheduler;
