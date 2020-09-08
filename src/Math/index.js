let cachedSeed = +new Date();

const rnd = (min, max, random) => (max - min) * random + min;

const generateRandomBetween1And0 = () => {
    const m = Number.MAX_SAFE_INTEGER;
    const a = 349;
    const c = 997;
    let seed = cachedSeed;
    cachedSeed = (a * seed + c) % m;

    return cachedSeed / m;
};

const calculateProbability = (time, totalTime) => {
    const division = (time / totalTime) * 100;

    return division.toPrecision(division>=10 ? 4 : 3);
};

const nth = (n) => ["st","nd","rd"][((n+90)%100-10)%10-1]||"th"

module.exports = { rnd, generateRandomBetween1And0, calculateProbability, nth }
