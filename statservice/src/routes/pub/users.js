// @ts-check

const { checkExact, param } = require("express-validator");
const { STATUS_CODES } = require("http");
const validation = require("../../validation");
const { User, Game } = require("../../model");
const { removeMongoDBFields } = require("../../utils");

/**
 * @param {import("express").Router} app
 */
module.exports = (app) => {
  app.get(
    "/users/:username",
    ...validation.setup(validation.fields.username(param), checkExact()),
    async (req, res) => {
      const user = await getUser(req, res);
      if (user == null) return;

      const games = await Game.find(
        { user: user._id },
        { userId: 0 },
        { populate: "questions.question" }
      );

      res.json({
        success: true,
        username: user.username,
        stats: computeStatsGames(games),
      });
    }
  );

  app.get(
    "/users/:username/games",
    ...validation.setup(
      validation.fields.pagination.page,
      validation.fields.pagination.size,
      validation.fields.username(param),
      checkExact()
    ),
    async (req, res) => {
      /** @type {any} */
      const { page, size } = req.query;

      const user = await getUser(req, res);
      if (user == null) return;

      const games = await Game.find(
        { user: user._id },
        { userId: 0 },
        {
          sort: { createdAt: -1 },
          populate: "questions.question",
          limit: size,
          skip: page * size,
        }
      );

      res.json({
        success: true,
        username: user.username,
        games: games.map((g) =>
          g.toJSON({
            transform: removeMongoDBFields,
          })
        ),
      });
    }
  );
};

/**
 * Gets the user and fails the request if not found.
 *
 * @typedef {import('mongoose').InferSchemaType<typeof User.schema>} UserType
 *
 * @param {import("express").Request} req Request
 * @param {import("express").Response} res Response
 * @return {Promise<import('mongoose').Document<unknown, {}, UserType> & UserType| null>} User or null
 */
async function getUser(req, res) {
  const user = await User.findOne(
    {
      username: req.params.username.toString(),
    },
    { username: 1 }
  );

  if (user == null) {
    res.status(404).json({
      success: false,
      message: STATUS_CODES[404],
    });
  }

  return user;
}

/**
 * Computes the stats from a set of games.
 *
 * @param {import("mongoose").InferSchemaType<typeof Game.schema>[]} games
 */
function computeStatsGames(games) {
  if (games.length === 0)
    return {
      time: {
        total: 0,
        game: {
          min: 0,
          max: 0,
          avg: 0,
        },
        question: {
          min: 0,
          max: 0,
          avg: 0,
        },
      },
      question: {
        passed: 0,
        failed: 0,
        total: 0,
      },
      game: {
        total: 0,
      },
    };

  const stats = {
    time: {
      total: 0,
      game: {
        min: Number.MAX_VALUE,
        max: 0,
        avg: -1,
      },
      question: {
        min: Number.MAX_VALUE,
        max: 0,
        avg: -1,
      },
    },
    question: {
      passed: 0,
      failed: 0,
      total: -1,
    },
    game: {
      total: games.length,
    },
  };

  for (const game of games) {
    const gameTime = game.time.finished.getTime() - game.time.started.getTime();

    console.log(gameTime);

    stats.time.total += gameTime;
    stats.time.game.min = Math.min(stats.time.game.min, gameTime);
    stats.time.game.max = Math.max(stats.time.game.max, gameTime);

    for (const question of game.questions) {
      const questionTime =
        question.time.finished.getTime() - question.time.started.getTime();

      stats.time.question.min = Math.min(stats.time.question.min, questionTime);
      stats.time.question.max = Math.max(stats.time.question.max, questionTime);

      // @ts-expect-error
      if (question.selected === question.question.answers.correct)
        stats.question.passed++;
      else stats.question.failed++;
    }
  }

  stats.question.total = stats.question.passed + stats.question.failed;

  stats.time.game.avg = stats.time.total / games.length;
  stats.time.question.avg = stats.time.total / stats.question.total;

  console.log(stats.time);

  return stats;
}
