const { Event, EnumEvent } = require('./Event');

const aleatorios = [0.3276, 0.8851, 0.1643, 0.5542, 0.6813, 0.7221, 0.9881];

const filaConfig = {
    server: 1,
    capacidade: 3,
    atendimentoMin: 1,
    atendimentoMax: 2,
    esperaMin: 3,
    esperaMax: 6,
    inicio: 2,
};

const tempos = {};
const eventos = [];
let FILA = 0;
let currentTime = 0,
    previousTime = 0;
let perda = 0;

// move to 'utils' file
const rnd = (min, max) => (max - min) * aleatorios.shift() + min;

const contabiliza = () => {
    const time = currentTime - previousTime;
    tempos[FILA] = (Number(tempos[FILA]) || 0) + time;
};

const processaChegada = () => {
    contabiliza();

    if (FILA < filaConfig.capacidade) {
        FILA++;
        if (FILA <= filaConfig.server) agendaSaida();
    } else perda++;

    agendaChegada();
};

const processaSaida = () => {
    contabiliza();

    FILA--;

    if (FILA >= filaConfig.server) agendaSaida();
};

const agendaChegada = (inicio) => {
    const { atendimentoMin, atendimentoMax } = filaConfig;

    const tempoChegada =
        currentTime + (inicio || rnd(atendimentoMin, atendimentoMax));

    const chegada = new Event(EnumEvent.ARRIVAL, tempoChegada, FILA);

    eventos.push(chegada);
};

const agendaSaida = () => {
    const { esperaMin, esperaMax } = filaConfig;

    const tempoSaida = currentTime + rnd(esperaMin, esperaMax);

    const saida = new Event(EnumEvent.EXIT, tempoSaida, FILA);

    eventos.push(saida);
};

const run = () => {
    const event = eventos.sort((a, b) => a.time - b.time).shift();

    //console.log(event);

    previousTime = currentTime;
    currentTime = event.time;

    if (event.type === 'CHEGADA') {
        processaChegada();
    } else if (event.type === 'SAÍDA') {
        processaSaida();
    }
};

/////// m a i n

// primeiro agenda uma chegada
agendaChegada(filaConfig.inicio);

while (aleatorios.length > 0) {
    run();
}

console.warn(`PERDA: ${perda}`);
