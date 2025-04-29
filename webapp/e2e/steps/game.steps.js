const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;

const feature = loadFeature("./features/game.feature");
let browser;
let page;

jest.setTimeout(300000);

const waitForQuestionToLoad = async () => {
  await page.waitForSelector('[data-testid="question-image"]');
  await page.waitForSelector('[data-testid="hint-input"]');
};

defineFeature(feature, (test) => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({
          headless: "new",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          slowMo: 20,
        })
      : await puppeteer.launch({ headless: false, slowMo: 20 });
    page = await browser.newPage();

    page.setViewport({ width: 1000, height: 750 });

    // Way of setting up the timeout
    setDefaultOptions({ timeout: 300000 });

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});

    // Wait for the navbar and click the "Register" button
    await page.waitForSelector('button[data-testid="register-nav"]');
    await page.click('button[data-testid="register-nav"]');

    // Register
    const usernameInput = await page.$('[data-testid="reg-username"] input');
    const passwordInput = await page.$('[data-testid="reg-password"] input');
    const confPasswordInput = await page.$(
      '[data-testid="reg-confirm-password"] input'
    );

    await usernameInput.type("testGame");
    await passwordInput.type("StrongPass123!");
    await confPasswordInput.type("StrongPass123!");
    await page.click('button[type="submit"]');

    // Enter game
    await page.waitForSelector('[data-testid="play-button"]');
    await page.click('[data-testid="play-button"]');

    await page.waitForSelector('[data-testid="game-mode-0"]');
    await page.click('[data-testid="game-mode-normal"]');
  });

  afterAll(async () => {
    await browser.close();
  });

  afterEach(async () => {
    await page.waitForSelector('button[data-testid="home-nav"]');
    await page.click('button[data-testid="home-nav"]');
    await page.waitForSelector('[data-testid="play-button"]');
    await page.click('[data-testid="play-button"]');

    await page.waitForSelector('[data-testid="game-mode-0"]');
    await page.click('[data-testid="game-mode-normal"]');

    await waitForQuestionToLoad();
  });

  test("Request a hint and display it", ({ given, when, then, and }) => {
    given("I am logged in at game", async () => {
      const url = page.url();
      await expect(url).toContain("/game");
      await waitForQuestionToLoad();
    });

    and("I have entered a question in the input field", async () => {
      const hintInput = await page.$('[data-testid="hint-input"] input', {
        visible: true,
      });
      await hintInput.type("What is this?");
    });

    and("I have remaining hints", async () => {
      const hintText = await page.$eval(
        '[data-testid="hints-used"]',
        (el) => el.textContent
      );
      const partsAfterLabel = hintText.split(":")[1]?.trim();
      if (partsAfterLabel) {
        const [usedStr, totalStr] = partsAfterLabel
          .split("/")
          .map((part) => part.trim());
        const used = parseInt(usedStr, 10);
        expect(used).toBeLessThan(1);
      } else {
        console.warn("Could not parse hints information:", hintText);
        expect(true).toBe(false);
      }
    });

    when("I click the hint button", async () => {
      await page.click('[data-testid="hint-button"]');
    });

    then("the hint counter should increase by 1", async () => {
      await page.waitForTimeout(2000);
      const hintText = await page.$eval(
        '[data-testid="hints-used"]',
        (el) => el.textContent
      );
      const partsAfterLabel = hintText.split(":")[1]?.trim();
      if (partsAfterLabel) {
        const [usedStr, totalStr] = partsAfterLabel
          .split("/")
          .map((part) => part.trim());
        const used = parseInt(usedStr, 10);
        const total = parseInt(totalStr, 10);
        expect(used).toBeGreaterThan(0);
      } else {
        console.warn("Could not parse hints information:", hintText);
        expect(true).toBe(false);
      }
    });

    and("the hint input should be temporally disabled", async () => {
      const disabled = await page.$eval('[data-testid="hint-button"]', (el) =>
        el.hasAttribute("disabled")
      );
      expect(disabled).toBe(true);
    });
  });

  test("Next round answering", ({ given, when, then, and }) => {
    given("I am logged in at game", () => {});

    when("I answer the question", async () => {
      const hintInput = await page.$('[data-testid="hint-input"] input', {
        visible: true,
      });
      await hintInput.type("What is this?");
      await page.click('[data-testid="hint-button"]'); // For checking the hints reset
      await page.waitForTimeout(1000);
      await page.click('[data-testid="option-0"]');
      await page.waitForTimeout(2000);
      await waitForQuestionToLoad();
    });

    then("the round should increase", async () => {
      const roundText = await page.$eval(
        '[data-testid="round-info"]',
        (el) => el.textContent
      );
      const partsAfterLabel = roundText.split(":")[1]?.trim();
      if (partsAfterLabel) {
        const [currentStr, totalStr] = partsAfterLabel
          .split("/")
          .map((part) => part.trim());
        const current = parseInt(currentStr, 10);
        expect(current).toBeGreaterThan(1);
      } else {
        console.warn("Could not parse round information:", roundText);
        expect(true).toBe(false);
      }
    });

    and("the hints requests reset", async () => {
      const hintText = await page.$eval(
        '[data-testid="hints-used"]',
        (el) => el.textContent
      );
      const partsAfterLabel = hintText.split(":")[1]?.trim();
      if (partsAfterLabel) {
        const [usedStr, totalStr] = partsAfterLabel
          .split("/")
          .map((part) => part.trim());
        const used = parseInt(usedStr, 10);
        expect(used).toBe(0);
      } else {
        console.warn("Could not parse hints information:", hintText);
        expect(true).toBe(false);
      }
    });

    and("the time reset", async () => {
      const progressValue = await page.$eval(
        '[data-testid="time-progress-bar"]',
        (el) => el.getAttribute("aria-valuenow")
      );
      expect(Number(progressValue)).toBeGreaterThan(75);
    });
  });

  test("Next round time", ({ given, when, then, and }) => {
    given("I am logged in at game", async () => {});

    when("question time runs out", async () => {
      const hintInput = await page.$('[data-testid="hint-input"] input', {
        visible: true,
      });
      await hintInput.type("What is this?");
      await page.click('[data-testid="hint-button"]'); // For checking the hints reset
      await page.waitForTimeout(21000);
      await waitForQuestionToLoad();
    });

    then("the round should increase", async () => {
      const roundText = await page.$eval(
        '[data-testid="round-info"]',
        (el) => el.textContent
      );
      const partsAfterLabel = roundText.split(":")[1]?.trim();
      if (partsAfterLabel) {
        const [currentStr, totalStr] = partsAfterLabel
          .split("/")
          .map((part) => part.trim());
        const current = parseInt(currentStr, 10);
        expect(current).toBeGreaterThan(1);
      } else {
        console.warn("Could not parse round information:", roundText);
        expect(true).toBe(false);
      }
    });

    and("the hints requests reset", async () => {
      const hintText = await page.$eval(
        '[data-testid="hints-used"]',
        (el) => el.textContent
      );
      const partsAfterLabel = hintText.split(":")[1]?.trim();
      if (partsAfterLabel) {
        const [usedStr, totalStr] = partsAfterLabel
          .split("/")
          .map((part) => part.trim());
        const used = parseInt(usedStr, 10);
        expect(used).toBe(0);
      } else {
        console.warn("Could not parse hints information:", hintText);
        expect(true).toBe(false);
      }
    });

    and("the time reset", async () => {
      const progressValue = await page.$eval(
        '[data-testid="time-progress-bar"]',
        (el) => el.getAttribute("aria-valuenow")
      );
      expect(Number(progressValue)).toBeGreaterThan(75);
    });
  });

  test("Finish game", ({ given, when, then, and }) => {
    given("I am logged in at game", async () => {});

    when("I answer all the rounds", async () => {
      const roundText = await page.$eval(
        '[data-testid="round-info"]',
        (el) => el.textContent
      );
      const partsAfterLabel = roundText.split(":")[1]?.trim();
      if (partsAfterLabel) {
        const [currentStr, totalStr] = partsAfterLabel
          .split("/")
          .map((part) => part.trim());
        let total = parseInt(totalStr, 10);
        for (let i = 0; i < total; i++) {
          await page.waitForTimeout(1000);
          await page.click('[data-testid="option-0"]');
          await page.waitForTimeout(2000);
          if (i != total - 1) await waitForQuestionToLoad();
        }
      } else {
        console.warn(
          "Could not parse round information for game end:",
          roundText
        );
        expect(true).toBe(false);
      }
    });

    then("the game should end", async () => {
      await page.waitForSelector('[data-testid="end-text"]');
    });

    and("I am redirected to the end game page", async () => {
      const url = page.url();
      expect(url).toContain("/end-game");
    });
  }, 300000);
});
