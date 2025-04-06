module.exports = {
    musician: `
      SELECT ?musicianLabel ?birthDate ?image
      WHERE {
        ?musician wdt:P106 wd:Q639669;
                  wdt:P27 wd:Q145;
                  wdt:P569 ?birthDate;
                  wdt:P18 ?image.
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
      }
      LIMIT 20
    `,
    
    scientist: `
      SELECT ?scientistLabel ?birthDate ?image
      WHERE {
        ?scientist wdt:P106 wd:Q901;
                   wdt:P569 ?birthDate;
                   wdt:P18 ?image.
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
      }
      LIMIT 20
    `,
    
    actor: `
      SELECT ?actorLabel ?birthDate ?image
      WHERE {
        ?actor wdt:P106 wd:Q33999;
               wdt:P569 ?birthDate;
               wdt:P18 ?image.
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
      }
      LIMIT 20
    `,
    
    painter: `
      SELECT ?painterLabel ?birthDate ?image
      WHERE {
        ?painter wdt:P106 wd:Q1028181;
                 wdt:P569 ?birthDate;
                 wdt:P18 ?image.
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
      }
      LIMIT 20
    `,
    
    writer: `
      SELECT ?writerLabel ?birthDate ?image
      WHERE {
        ?writer wdt:P106 wd:Q36180;
                wdt:P569 ?birthDate;
                wdt:P18 ?image.
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
      }
      LIMIT 20
    `
  };