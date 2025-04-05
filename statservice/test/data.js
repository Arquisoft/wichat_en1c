const date = new Date("2021-01-01");
const date2 = new Date("2021-01-01T00:00:15Z");
const date3 = new Date("2021-01-01T00:00:20Z");

// Test data
const game = {
  time: {
    started: date,
    finished: date3,
  },
  config: {
    mode: "musicians",
    rounds: 2,
    time: 100,
    hints: 3,
  },
  questions: [
    {
      time: {
        started: date,
        finished: date2,
      },
      image: "https://example.com/image1.jpg",
      question: "Question1",
      answers: {
        opts: ["1", "2"],
        selected: 0,
        correct: 1,
      },
    },
    {
      time: {
        started: date2,
        finished: date3,
      },
      image: "https://example.com/image2.jpg",
      question: "Question2",
      answers: {
        opts: ["1", "2"],
        selected: 0,
        correct: 0,
      },
    },
  ],
};
const dbGame = {
  ...game,
  questions: [
    {
      time: {
        started: date,
        finished: date2,
      },
      question: {
        image: "https://example.com/image1.jpg",
        question: "Question1",
        answers: {
          opts: ["1", "2"],
          correct: 1,
        },
      },
      selected: 0,
    },
    {
      time: {
        started: date2,
        finished: date3,
      },
      question: {
        image: "https://example.com/image2.jpg",
        question: "Question2",
        answers: {
          opts: ["1", "2"],
          correct: 0,
        },
      },
      selected: 0,
    },
  ],
};

const jsonGame = {
  ...game,
  time: {
    started: date.toISOString(),
    finished: date3.toISOString(),
  },
  questions: [
    {
      time: {
        started: date.toISOString(),
        finished: date2.toISOString(),
      },
      question: {
        image: "https://example.com/image1.jpg",
        question: "Question1",
        answers: {
          opts: ["1", "2"],
          correct: 1,
        },
      },
      selected: 0,
    },
    {
      time: {
        started: date2.toISOString(),
        finished: date3.toISOString(),
      },
      question: {
        image: "https://example.com/image2.jpg",
        question: "Question2",
        answers: {
          opts: ["1", "2"],
          correct: 0,
        },
      },
      selected: 0,
    },
  ],
};

const stats = {
  time: {
    total: 20_000,
    game: { min: 20_000, max: 20_000, avg: 20_000 },
    question: { min: 5_000, max: 15_000, avg: 10_000 },
  },
  question: { passed: 1, failed: 1, total: 2 },
  game: { total: 1 },
};

module.exports = {
  game,
  dbGame,
  jsonGame,
  stats,
};
