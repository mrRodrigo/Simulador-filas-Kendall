const { Event, EnumEvent } = require('./Event');
const { rnd, generateRandomBetween1And0 } = require('./Math');

class Scheduler {
    constructor(queue, randomList) {
        this.queue = queue;
        //Recebo um array de filas para processar e trabalhar.
        //fila1 = _queues[0]. fila2 = queues[1]
        this._queues = [];
        this.currentTime = 0;
        this.previousTime = 0;
        this.loss = 0;
        this._loss = [];
        this.events = []; // events to be processed
        this.logEvents = []; // only for log in the end of simulation
        this.statesTime = {}; // all time for each states
        this.randomList = randomList;
    };

    //O escalonador precisa ter as variáveis:
    //

    setRandomList(randomList){
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

        //SE FILA1 < 3
        if (this.queue.position < this.queue.capacity) {
            //FILA1++
            this.queue.incrementPosition();
            //SE FILA1 <= 2
            if (this.queue.position <= this.queue.size) {
                //ALTERAR PARA PASSAGEM DE 1->2
                this.schedulerExit();
            }
        } else {
            //this._loss[fila_atual]++;
            this.loss++;
        }

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

        //SE FILA2 >= 1
        if (this.queue.position >= this.queue.size) {
            this.schedulerExit();
        }

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

    schedulerPassage() {

        const { awaitMin, awaitMax } = this.queue[0];

        const tempoSaida = this.currentTime + rnd(awaitMin, awaitMax, this.shiftRandom());

        this.events.push(new Event('PASSAGE', tempoSaida, this.queue.position))

    };

    processPassage() {
        this.countTime();

        const fila1 = this._queues[0];
        const fila2 = this._queues[1];

        fila1.decrementPosition();

        if (fila1.position >= fila1.size) {
            this.schedulerPassage();
        } if (fila2.position < fila2.capacity) {
            fila2.incrementPosition();
            if(fila2.position <= fila2.size) {
                this.schedulerExit();
            }
        }

    }

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
        } else if (event.type === 'PASSAGE') {
            this.processPassage(event);
        }
    };
}


module.exports = Scheduler;
