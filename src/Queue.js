const { rnd } = require('./Math');

class Queue {
    constructor({ size, arrivalMin, arrivalMax, awaitMin, awaitMax, number, capacity, network }) {
        this.size = size;
        this.arrivalMin = arrivalMin;
        this.arrivalMax = arrivalMax;
        this.awaitMin = awaitMin;
        this.awaitMax = awaitMax;
        this.number = number;
        this.capacity = capacity;
        this.network = network;
        this.position = 0;
        this.loss = 0;
        this.timeEachPosition = [];
    }

    incrementPosition() {
        this.position++;
    }

    decrementPosition() {
        this.position--;
    }

    loss() {
        this.loss++;
    }

    timeAccount(time) {

        this.timeEachPosition[this.position] = (this.timeEachPosition[this.position] || 0) + time;
    }
}

module.exports = Queue;
