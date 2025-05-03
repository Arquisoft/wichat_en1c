// @ts-check

const config = require("./config");
const { generateQuestions } = require("./questions");

const questionCache = Object.fromEntries(
  Object.getOwnPropertyNames(config.categories).map((name) => [
    name,
    { blocked: false, questions: [] },
  ])
);

/**
 * Refills the question cache with new questions.
 * This function will keep generating questions until the cache reaches the specified size.
 * @param {string[]} categories Categories of questions to refill
 * @returns {Promise<void>} - A promise that resolves when the cache is refilled
 */
async function refillCache(...categories) {
  for (const category of categories) {
    const catCache = questionCache[category];

    if (catCache.blocked || catCache.questions.length >= config.refillThreshold)
      continue;

    catCache.blocked = true;
    for await (const question of generateQuestions(
      category,
      "en",
      config.cacheSize
    ))
      catCache.questions.push(
        //@ts-expect-error
        question
      );
    catCache.blocked = false;
  }
}

async function getQuestion(category, logger) {
  let question;
  // On the fly question generation
  if (questionCache[category].questions.length === 0) {
    logger.warn(`Cache ${category} empty, generating question on the fly`);
    question = (await generateQuestions(category, "en", 1).next()).value;
  }
  // Get question from cache
  else question = questionCache[category].questions.shift();

  // Refill cache if needed
  refillCache(category).catch((err) =>
    logger.error(err, "Error refilling cache")
  );

  return question;
}

module.exports = {
  refillCache,
  getQuestion,
};
