const { EnumVerbose, EnumTimesToRun } = require('./src/Commands');

const execute = (options) => {
    const params = {};

    // verbose param is present
    if(options.some(param => EnumVerbose.includes(param))) params.verbose = true;

    // run param is present
    const run = options.find(param => EnumTimesToRun.includes(param))

    if(run) params.run = Number(options[options.indexOf(run) + 1 ]) || 1;

    return params;
};

module.exports = execute;
