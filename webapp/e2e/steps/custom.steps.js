const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;

const feature = loadFeature("./features/custom.feature"); 
let browser;
let page;

jest.setTimeout(300000); 

const waitForQuestionToLoad = async () => {
    await page.waitForSelector('[data-testid="question-image"]');
    await page.waitForSelector('[data-testid="hint-input"]');
};

const expectPageToContain = async (text) => {
    await page.waitForTimeout(2000);
    return (await page.content()).includes(text);
};

defineFeature(feature, (test) => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
        ? await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            slowMo: 30,
          })
        : await puppeteer.launch({ headless: false, slowMo: 30 });
    page = await browser.newPage();
    page.setViewport({ width: 1000, height: 750 });
    setDefaultOptions({ timeout: 300000 }); 
    await page
      .goto("http://localhost:3000", { waitUntil: "networkidle0" })
      .catch(() => {});

    // Wait for the language selector to be available
    await page.waitForSelector('div.MuiSelect-select'); 

    // Open the language dropdown
    await page.click('div.MuiSelect-select');

    // Select Spanish (ES)
    await page.waitForSelector('li[data-value="es"]');
    await page.click('li[data-value="es"]');

    // Wait for the navbar and click the "Register" button
    await page.waitForSelector('button[data-testid="register-nav"]');
    await page.click('button[data-testid="register-nav"]');

    // Register
    const usernameInput = await page.$('[data-testid="reg-username"] input');
    const passwordInput = await page.$('[data-testid="reg-password"] input');
    const confPasswordInput = await page.$(
      '[data-testid="reg-confirm-password"] input'
    );

    await usernameInput.type("testCustomGame");
    await passwordInput.type("StrongPass123!");
    await confPasswordInput.type("StrongPass123!");
    await page.click('button[type="submit"]');

    // Go to custom game
    await page.waitForSelector('[data-testid="play-button"]');
    await page.click('[data-testid="play-button"]');
    await page.waitForSelector('[data-testid="game-mode-2"]');
    await page.click('[data-testid="game-mode-custom"]');
  });

  afterAll(async () => {
    await browser.close();
  });

  afterEach(async () => {
    // Go to home and then to custom game page.
    await page.waitForSelector('button[data-testid="home-nav"]');
    await page.click('button[data-testid="home-nav"]');
    await page.waitForSelector('[data-testid="play-button"]');
    await page.click('[data-testid="play-button"]');
    await page.waitForSelector('[data-testid="game-mode-2"]');
    await page.click('[data-testid="game-mode-custom"]');
  });

  test("Create a custom game", ({ given, when, then, and }) => {
    given("I am logged at custom game", async () => {
      await page.waitForSelector('[data-testid="custom-game-title"]');
      const url = page.url();
      expect(url).toContain("/custom"); 
    });

    and("I have entered my custom configuration", async () => {
      const roundsInput = await page.$('[data-testid="rounds-input"]');
      const hintsInput = await page.$('[data-testid="hints-input"]');

      await roundsInput.click({ clickCount: 3 }); 
      await page.keyboard.press('Backspace');     
      await roundsInput.type("33");

      await hintsInput.click({ clickCount: 3 }); 
      await page.keyboard.press('Backspace');     
      await hintsInput.type("2");
    });

    when("I click the start button", async () => {
      await page.click('[data-testid="start-game-button"]');
    });

    then("the game its initialiced with my configuration", async () => {
      await waitForQuestionToLoad()
      const url = page.url();
      expect(url).toContain("/game");

      // Round check
      const roundText = await page.$eval(
        '[data-testid="round-info"]',
        (el) => el.textContent
      );
      const partsAfterLabel = roundText.split(":")[1]?.trim();
      if (partsAfterLabel) {
        const [currentStr, totalStr] = partsAfterLabel
          .split("/")
          .map((part) => part.trim());
        const total = parseInt(totalStr, 10);
        expect(total).toBe(33);
      } else {
        console.warn("Could not parse round information:", roundText);
        expect(true).toBe(false);
      }

      // Hint check
      const hintText = await page.$eval(
        '[data-testid="hints-used"]',
        (el) => el.textContent
      );
      const partsAfterLabelHint = hintText.split(":")[1]?.trim();
      if (partsAfterLabelHint) {
        const [usedStr, totalStr] = partsAfterLabelHint
          .split("/")
          .map((part) => part.trim());
        const total = parseInt(totalStr, 10);
        expect(total).toBe(2);
      } else {
        console.warn("Could not parse hints information:", hintText);
        expect(true).toBe(false);
      }
    });
  });

  test("Create a custom infinite game", ({ given, when, then, and }) => {
    given("I am logged at custom game", async () => {
      await page.waitForSelector('[data-testid="custom-game-title"]');
      const url = page.url();
      expect(url).toContain("/custom");
    });

    and("I have entered my custom configuration", async () => {
      const hintsInput = await page.$('[data-testid="hints-input"]');

      await hintsInput.click({ clickCount: 3 }); 
      await page.keyboard.press('Backspace'); 
      await hintsInput.type("4");
    });

    and("I have selected infinite mode", async () => {
        const switchInput = await page.$('[data-testid="infinite-rounds-switch"]');
        await switchInput.focus();
        await page.keyboard.press("Space");
    });

    when("I click the start button", async () => {
      await page.click('[data-testid="start-game-button"]');
    });

    then("the game its initialiced with my configuration", async () => {
      await waitForQuestionToLoad();
      const url = page.url();
      expect(url).toContain("/game");

      // Hint check
      const hintText = await page.$eval(
        '[data-testid="hints-used"]',
        (el) => el.textContent
      );
      const partsAfterLabelHint = hintText.split(":")[1]?.trim();
      if (partsAfterLabelHint) {
        const [usedStr, totalStr] = partsAfterLabelHint
          .split("/")
          .map((part) => part.trim());
        const total = parseInt(totalStr, 10);
        expect(total).toBe(4);
      } else {
        console.warn("Could not parse hints information:", hintText);
        expect(true).toBe(false);
      }
    });

    and("the rounds are now infinite", async () => {
        await expect(await expectPageToContain("Modo Infinito")).toBe(true);
    });
  });

  test("Create a custom AI game", ({ given, when, then, and }) => {
    given("I am logged at custom game", async () => {
      await page.waitForSelector('[data-testid="custom-game-title"]');
      const url = page.url();
      expect(url).toContain("/custom");
    });

    and("I have entered my custom configuration", async () => {
      const roundsInput = await page.$('[data-testid="rounds-input"]');
      const hintsInput = await page.$('[data-testid="hints-input"]');

      await roundsInput.click({ clickCount: 3 }); 
      await page.keyboard.press('Backspace'); 
      await roundsInput.type("1");

      await hintsInput.click({ clickCount: 3 }); 
      await page.keyboard.press('Backspace'); 
      await hintsInput.type("0");
    });

    and("I have selected AI game mode", async () => {
        const switchInput = await page.$('[data-testid="ai-game-switch"]');
        await switchInput.focus();
        await page.keyboard.press("Space");
    });

    when("I click the start button", async () => {
      await page.click('[data-testid="start-game-button"]');
    });

    then("the game its initialiced with my configuration", async () => {
      await waitForQuestionToLoad();
      const url = page.url();
      expect(url).toContain("/game-ai");

      // Round check
      const roundText = await page.$eval(
        '[data-testid="round-info"]',
        (el) => el.textContent
      );
      const partsAfterLabel = roundText.split(":")[1]?.trim();
      if (partsAfterLabel) {
        const [currentStr, totalStr] = partsAfterLabel
          .split("/")
          .map((part) => part.trim());
        const total = parseInt(totalStr, 10);
        expect(total).toBe(1);
      } else {
        console.warn("Could not parse round information:", roundText);
        expect(true).toBe(false);
      }

      // Hint check
      const hintText = await page.$eval(
        '[data-testid="hints-used"]',
        (el) => el.textContent
      );
      const partsAfterLabelHint = hintText.split(":")[1]?.trim();
      if (partsAfterLabelHint) {
        const [usedStr, totalStr] = partsAfterLabelHint
          .split("/")
          .map((part) => part.trim());
        const total = parseInt(totalStr, 10);
        expect(total).toBe(0);
      } else {
        console.warn("Could not parse hints information:", hintText);
        expect(true).toBe(false);
      }
    });

    and("when I finish the game I see the result vs the AI", async () => {
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

      await page.waitForSelector('[data-testid="end-text"]');  
      const url = page.url();
      expect(url).toContain("/end-game");

      await page.waitForSelector('[data-testid="ai-result"]')  
    });
  });
});
