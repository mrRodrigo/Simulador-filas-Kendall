const EnumEvent = { EXIT: 'SAIDA', ARRIVAL: 'CHEGADA' };

class Event {
    constructor(type, time, FILA) {
        this.type = type;
        this.time = time;
        this.FILA = FILA;
    }
}

module.exports = { Event, EnumEvent };
