const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;

const feature = loadFeature("./features/game.feature");
let browser;
let page;

jest.setTimeout(300000);

const waitForQuestionToLoad = async () => {
  await page.waitForSelector('[data-testid="question-image"]');
};

defineFeature(feature, (test) => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({
          headless: "new",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        })
      : await puppeteer.launch({ headless: false, slowMo: 30 });
    page = await browser.newPage();

    page.setViewport({width: 1280, height: 720});

    // Way of setting up the timeout
    setDefaultOptions({ timeout: 3000000 });

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

    await usernameInput.type("testGame");
    await passwordInput.type("StrongPass123!");
    await page.click('button[type="submit"]');

    // Go back to home page
    await page.waitForSelector('button[data-testid="home-nav"]');
    await page.click('button[data-testid="home-nav"]');
  });

  afterAll(async () => {
    await browser.close();
  });

  afterEach(async () => {
    await page.waitForSelector('button[data-testid="home-nav"]');
    await page.click('button[data-testid="home-nav"]');
    await page.click('[data-testid="play-button"]');

    await waitForQuestionToLoad();
  });

  const login = async () => {
    await page.waitForSelector('button[data-testid="login-nav"]');
    await page.click('button[data-testid="login-nav"]');
    const usernameInput = await page.$('[data-testid="log-username"] input');
    const passwordInput = await page.$('[data-testid="log-password"] input');
    await usernameInput.type("testGame");
    await passwordInput.type("StrongPass123!");
    await page.click('button[type="submit"]');
    await page.waitForSelector('button[data-testid="home-nav"]');
    await page.click('button[data-testid="home-nav"]');
  };

  test("Try to enter the game without logging in", ({ given, when, then }) => {
    given("I am on the home page", async () => {
      await page.waitForSelector('button[data-testid="home-nav"]');
      await page.click('button[data-testid="home-nav"]');
    });

    when("I try to access the game", async () => {
      await page.click('[data-testid="play-button"]');
    });

    then("I should be redirected to the login page", async () => {
      const url = page.url();
      expect(url).toContain("/login");
      await login();
    });
  });

  test("Request a hint and display it", ({ given, when, then, and }) => {
    given("I am logged in at game", async () => {
      const url = page.url();
      await expect(url).toContain("/game");
    });

    and("I have entered a question in the input field", async () => {
      const hintInput = await page.$('[data-testid="hint-input"] input');
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

    then("the hint counter should decrease by 1", async () => {
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
        expect(used).toBeLessThan(total);
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
      const hintInput = await page.$('[data-testid="hint-input"] input');
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
      expect(Number(progressValue)).toBeGreaterThan(80);
    });
  });

  test("Next round time", ({ given, when, then, and }) => {
    given("I am logged in at game", async () => {});

    when("question time runs out", async () => {
      const hintInput = await page.$('[data-testid="hint-input"] input');
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
      expect(Number(progressValue)).toBeGreaterThan(80);
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
