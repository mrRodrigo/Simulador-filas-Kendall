const { calculateProbability } = require('../Math');

class Logger {
    showSimulationData({ loss, logEvents, statesTime, queue }) {
        this._renderLine();
        this._formatQueueConfig(queue);
        this._renderLine();
        console.log(`${' '.repeat(20)}*EVENTS*${' '.repeat(20)}`);
        this._formatEvents(logEvents);
        this._renderLine();
        this._renderLine();
        this._formatStatesTime(statesTime);
        this._formatLossAndFullTime(loss, logEvents);
        this._formatProbability(statesTime, logEvents);
    }

    _formatEvents(logEvents){
        console.table(
            logEvents.map(e => ({
                type: e.type,
                time: +this._formatTime(e.time),
                queueState: e.queueState
            }))
        );
    }
    _formatStatesTime(statesTime){
        const formated = Object.keys(statesTime).map(
            k => `With ${k} on the queue, ${this._formatTime(statesTime[k])} has been elapsed.`
        );

        formated.map(e => console.log(e));
    }

    _formatLossAndFullTime(loss, logEvents){
        this._renderLine();
        console.log(`Total loss: ${loss}  Total time: ${logEvents.slice(-1).pop().time}`);
    }

    _formatTime(time){
        return parseFloat(time).toFixed(4);
    }

    _renderLine(elem){
        console.log(`${ elem || '-' }`.repeat(50));
    }

    _formatQueueConfig(q){
        console.log(`Queue configuration${'.'.repeat(20)} G/G/${q.size}/${q.capacity}`);
    }

    _formatProbability(statesTime, logEvents){

        const elapsedTime = logEvents.slice(-1).pop().time;

        const formated = Object.keys(statesTime).map(
            k => ({
                state: k,
                time: this._formatTime(statesTime[k]),
                probability: calculateProbability(statesTime[k], elapsedTime)
            })
        );
        this._renderLine();
        console.log(`${' '.repeat(20)}*RESULTS*${' '.repeat(20)}`);
        this._renderLine();
        console.table(formated);
    }
}

module.exports = new Logger();
