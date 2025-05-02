// @ts-check
module.exports = {
  port: Number(process.env.PORT ?? 8004),
  wikidataUrl: "https://query.wikidata.org/sparql",
  cacheSize: Number(process.env.CACHE_SIZE ?? 10),
  refillThreshold: Number(process.env.REFILL_THRESHOLD ?? 3),
  initialRefill: true,
  categories: {
    musician: "wd:Q639669",
    scientist: "wd:Q901",
    actor: "wd:Q33999",
    painter: "wd:Q1028181",
    writer: "wd:Q36180",
  },
  categoriesES: {
    musician: "músico",
    scientist: "científico",
    actor: "actor",
    painter: "pintor",
    writer: "escritor",
  },
};
