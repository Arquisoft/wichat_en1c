// @ts-check
const config = require("./config");
const {
  sendQuery,
  buildBatchQuery,
  buildSpecificQuery,
  parseEntities,
  parseSpecificData,
} = require("./wikidata");

async function* generateQuestions(
  category,
  lang,
  quantity,
  numberOfChoices = 4
) {
  // Get necessary entities
  const entities = parseEntities(
    await sendQuery(buildBatchQuery(category, lang, quantity * numberOfChoices))
  );

  // Generate questions
  for (let i = 0; i < quantity; i++) {
    const chunk = entities.splice(0, numberOfChoices);

    // Select a random correct answer
    const correctEntity = chunk[Math.floor(Math.random() * chunk.length)];

    const { birthDate, image } = parseSpecificData(
      await sendQuery(buildSpecificQuery(correctEntity.id))
    );

    yield {
      category,
      image,
      options: chunk
        .map((entity) => entity.name)
        .sort(() => Math.random() - 0.5),
      correctAnswer: correctEntity.name,
      question: `Who is the ${category} born on ${birthDate.toLocaleDateString()} in the image?`,
      question_en: `Who is the ${category} born on ${birthDate.toLocaleDateString()} in the image?`,
      question_es: `¿Quién es el ${
        config.categoriesES[category]
      } nacido el ${birthDate.toLocaleDateString()} en la imagen?`,
    };
  }
}

module.exports = {
  generateQuestions,
};
