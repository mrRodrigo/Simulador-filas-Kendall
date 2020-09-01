const { Event, EnumEvent } = require('./Event');
const { rnd } = require('./random');

class Scheduler {
    constructor(queue, randomList) {
        this.queue = queue;
        this.currentTime = 0;
        this.previousTime = 0;
        this.loss = 0;
        this.events = [];
        this.tempos = {};
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
        const time = this.currentTime - this.previousTime;
        //tempos[this.queue.position] = (Number(tempos[this.queue.position]) || 0) + time;
    };

    processArrival() {
        this.countTime();

        if (this.queue.position < this.queue.capacity) {
            this.queue.incrementPosition();
            if (this.queue.position <= this.queue.size) this.schedulerExit();
        } else this.loss++;

        this.schedulerArrival();
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

    processExit() {
        this.countTime();

        this.queue.decrementPosition();

        if (this.queue.position >= this.queue.size) this.schedulerExit();
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

    execute() {
        const event = this.events.sort((a, b) => a.time - b.time).shift();

        console.log(event);

        this.previousTime = this.currentTime;
        this.currentTime = event.time;

        if (event.type === EnumEvent.ARRIVAL) {
            this.processArrival();
        } else if (event.type === EnumEvent.EXIT) {
            this.processExit();
        }
    };
}


module.exports = Scheduler;
