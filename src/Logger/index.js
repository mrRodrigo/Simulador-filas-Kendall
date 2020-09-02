class Logger {
    showSimulationData({ loss, logEvents, statesTime, queue }) {
        this._renderLine();
        this._formatQueueConfig(queue);
        this._renderLine();
        console.table(logEvents);
        this._renderLine();
        this._renderLine();
        this._formatStatesTime(statesTime);
        this._formatLossAndFullTime(loss);
    }

    _formatStatesTime(statesTime){
        const formated = Object.keys(statesTime).map(
            k => `With ${k} on the queue, ${this._formatTime(statesTime[k])} has been elapsed.`
        );
        formated.map(e => console.log(e));
    }

    _formatLossAndFullTime(loss){
        console.log(`\nTotal loss: ${loss}`);
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
}

module.exports = new Logger();
