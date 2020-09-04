let cachedSeed = +new Date();

const rnd = (min, max, random) => (max - min) * random + min;

const generateRandomBetween1And0 = () => {
    const m = Number.MAX_SAFE_INTEGER;
    const a = 349;
    const c = 997;
    let seed = cachedSeed;
    cachedSeed = (a * seed + c) % m;
  
    return cachedSeed / m;
}

module.exports = { rnd, generateRandomBetween1And0 }
