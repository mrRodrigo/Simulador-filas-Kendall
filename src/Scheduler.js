const { Event, EnumEvent } = require('./Event');
const { rnd, generateRandomBetween1And0 } = require('./Math');

class Scheduler {
    constructor(queues, randomList) {
        //this.queue = queue;
        //Recebo um array de filas para processar e trabalhar.
        //fila1 = _queues[0]. fila2 = queues[1]
        this._queues = queues;

        //variavel para cuidar de uma fila especifica
        //sempre começar em zero por ser a primeira fila
        this.currentQueue = 0;

        this.currentTime = 0;
        this.previousTime = 0;

        this.loss = 0;
        this._loss = [];
        this.events = []; // events to be processed
        this.logEvents = []; // only for log in the end of simulation
        //this.statesTime agora sera um array de objetos [{0: tempo, 1: tempo, 2: tempo}, {0: tempo, 1: tempo, 2: tempo}]
        //this.statesTime = {}; // all time for each states

        this.statesTimes = [{deltatime: 0}, {deltatime: 0}];

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

        const stateTimeForSpecificQueue = this.statesTimes[this.currentQueue];
        const currentQueue = this._queues[this.currentQueue];

        if(currentQueue.position === -1) {
            console.log('trem da alegria');
        }

        stateTimeForSpecificQueue[currentQueue.position] =
            (Number(stateTimeForSpecificQueue[currentQueue.position]) || 0) + deltaTime;
    };

    processArrival(event) {
        this.countTime();

        const currentQueue = this._queues[this.currentQueue];

        //SE FILA1 < 3
        if (currentQueue.position < currentQueue.capacity) {
            //FILA1++
            currentQueue.incrementPosition();
            //SE FILA1 <= 2
            if (currentQueue.position <= currentQueue.size) {
                //ALTERAR PARA PASSAGEM DE 1->2
                //this.schedulerExit();
                this.schedulerPassage();
            }
        } else {
            //this._loss[fila_atual]++;
            this._loss[currentQueue]++;
            //this.loss++;
        }

        this.schedulerArrival();

        this.logEvents.push(event);
    };

    schedulerArrival(init) {
        const currentQueue = this._queues[this.currentQueue];
        const { arrivalMin, arrivalMax } = currentQueue;

        const tempoChegada =
            this.currentTime + (init || rnd(arrivalMin, arrivalMax, this.shiftRandom()));

        this.events.push(
            new Event(
                EnumEvent.ARRIVAL,
                tempoChegada,
                currentQueue.position
            )
        );
    };

    processExit(event) {
        this.countTime();

        const currentQueue = this._queues[this.currentQueue];

        currentQueue.decrementPosition();

        //SE FILA2 >= 1
        if (currentQueue.position >= currentQueue.size) {
            this.schedulerExit();
        }

        this.logEvents.push(event);
    };

    schedulerExit() {
        const currentQueue = this._queues[this.currentQueue];

        const { awaitMin, awaitMax } = currentQueue;
        const tempoSaida = this.currentTime + rnd(awaitMin, awaitMax, this.shiftRandom());

        if(tempoSaida === 12.1832) {
            console.log('tempo correto: ',tempoSaida);
            
        }

        this.currentQueue--;

        this.events.push(
            new Event(
                EnumEvent.EXIT,
                tempoSaida,
                currentQueue.position
            )
        );
    };

    schedulerPassage() {

        const currentQueue = this._queues[this.currentQueue];
        const { awaitMin, awaitMax } = currentQueue;
        const tempoSaida = this.currentTime + rnd(awaitMin, awaitMax, this.shiftRandom());

        if(tempoSaida === 16.5453) {
            console.log('tempo correto', this.currentTime);
        }

        this.events.push(new Event(
            EnumEvent.PASSAGE,
            tempoSaida,
            currentQueue.position)
        )
    };

    processPassage(event) {
        this.countTime();

        const currentQueue = this._queues[this.currentQueue];

        const fila1 = this._queues[0];
        const fila2 = this._queues[1];

        if(this.currentTime === 16.5453) {
            console.log('tempo correto', this.currentTime);
        }
        
        fila1.decrementPosition();

        if (fila1.position >= fila1.size) {
            this.schedulerPassage();

        } if (fila2.position < fila2.capacity) {
            fila2.incrementPosition();

            if(fila2.position <= fila2.size) {
                this.currentQueue++;
                this.schedulerExit();
            }
        }

        

        this.logEvents.push(event);
    }

    getSimulationData(){
        console.log('logEvents \n', this.logEvents);

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
        } else if (event.type === EnumEvent.PASSAGE) {
            this.processPassage(event);
        }
    };
}


module.exports = Scheduler;
