class Queue {
    constructor({ number, capacity, arrivalMin, arrivalMax, awaitMin, awaitMax, init, size }) {
        this.number = number;
        this.capacity = capacity;
        this.arrivalMin = arrivalMin;
        this.arrivalMax = arrivalMax;
        this.awaitMin = awaitMin;
        this.awaitMax = awaitMax;
        this.size = size;
        this.init = init;
        this.position = 0;
    }

    incrementPosition() {
        this.position++;
    }

    decrementPosition() {
        this.position--;
    }

}

module.exports = Queue;
