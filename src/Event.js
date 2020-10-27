const EnumEvent = { EXIT: 'SAIDA', ARRIVAL: 'CHEGADA', PASSAGE: 'PASSAGEM' };

class Event {
    constructor(type, time, queue) {
        this.type = type;
        this.time = time;
        this.queue = queue;
    }
}

module.exports = { Event, EnumEvent };
