const EnumEvent = { EXIT: 'SAIDA', ARRIVAL: 'CHEGADA', PASSAGE: 'PASSAGEM' };

class Event {
    constructor(type, time, FILA, fila) {
        this.type = type;
        this.time = time;
        this.queueState = FILA;
        this.fila = fila;
    }
}

module.exports = { Event, EnumEvent };
