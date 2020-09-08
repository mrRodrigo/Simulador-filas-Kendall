const { calculateProbability, nth } = require('../Math');

class Logger {
    showAverageData(listOfExecutions, verbose){
        if(verbose)
            listOfExecutions.forEach(
                (e, index) => this._formatProbability(
                    e.statesTime,
                    e.logEvents,
                    ` OF ${index + nth(index)} EXECUTION`
                )
            );

        this._formatAverageProbability(listOfExecutions);
    }

    showSimulationData({ loss, logEvents, statesTime, queue }, verbose) {

        if(!verbose) return this._formatProbability(statesTime, logEvents);

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
                time: this._formatTime(e.time),
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

    _formatProbability(statesTime, logEvents, option = ''){

        const elapsedTime = logEvents.slice(-1).pop().time;

        const formated = Object.keys(statesTime).map(
            k => ({
                state: k,
                time: this._formatTime(statesTime[k]),
                probability: calculateProbability(statesTime[k], elapsedTime).concat('%')
            })
        );
        this._renderLine();
        console.log(`${' '.repeat(option ? 10 : 20)}*RESULTS${option && option}*${' '.repeat(20)}`);
        this._renderLine();
        console.table(formated);
    }

    _formatAverageProbability(listOfExecutions){
        const allPercent = {};
        const result = {};

        Array.from(listOfExecutions, (execution, _index) => {
            const { statesTime, logEvents } = execution;
            const elapsedTime = logEvents.slice(-1).pop().time;

            Object.keys(statesTime).map(key => {
                    if (allPercent[key] instanceof Array)
                        allPercent[key].push(Number(calculateProbability(statesTime[key], elapsedTime)))
                    else allPercent[key] = [];
                }
            );
        });

        Object.keys(allPercent).map(key => {
            result[key] = {
                state: key,
                probability: this._formatTime(
                    allPercent[key].reduce((previous, current) => current += previous) / allPercent[key].length
                ).concat('%'),
        }});

        this._renderLine();
        console.log(`${' '.repeat(15)}*AVERAGE RESULT*${' '.repeat(15)}`);
        this._renderLine();
        console.table(result);
    }
}

module.exports = new Logger();
