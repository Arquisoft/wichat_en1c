const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const feature = loadFeature("./features/stats.feature");

let page;
let browser;

const expectPageToContain = async (text) => {
    await page.waitForTimeout(2000);
    return (await page.content()).includes(text);
};

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

    // Wait for the language selector to be available
    await page.waitForSelector('div.MuiSelect-select'); 

    // Open the language dropdown
    await page.click('div.MuiSelect-select');

    // Select Spanish (ES)
    await page.waitForSelector('li[data-value="es"]');
    await page.click('li[data-value="es"]');

    await page.waitForSelector('button[data-testid="register-nav"]');
    await page.click('button[data-testid="register-nav"]');

    // Register
    const usernameInput = await page.$('[data-testid="reg-username"] input');
    const passwordInput = await page.$('[data-testid="reg-password"] input');
    const confPasswordInput = await page.$(
      '[data-testid="reg-confirm-password"] input'
    );

    await usernameInput.type("testStats");
    await passwordInput.type("StrongPass123!");
    await confPasswordInput.type("StrongPass123!");
    await page.click('button[type="submit"]');

    await page.waitForSelector('button[data-testid="logout-nav"]');
    await page.click('button[data-testid="logout-nav"]');
  });

  afterAll(async () => {
    await browser.close();
  });

  afterEach(async () => {
    // Navigate to home 
    await page.waitForSelector('button[data-testid="home-nav"]');
    await page.click('button[data-testid="home-nav"]');
  });

  test("Cannot access stats if not logged in", ({ given, when, then }) => {
    given("I am not logged in", async () => {});

    when("I click the stats button", async () => {
      await page.waitForSelector('[data-testid="stats-nav"]');
      await page.click('[data-testid="stats-nav"]');
    });

    then("I am redirected to login page", async () => {
        await page.waitForSelector('[data-testid="log-title"]');
      const url = page.url();
      expect(url).toContain("/login");
    });
  });

  test("No stats displayed when you haven't played any game", ({
    given,
    and,
    when,
    then,
  }) => {

    given("I am logged in", async () => {
      await page.waitForSelector('button[data-testid="login-nav"]');
      await page.click('button[data-testid="login-nav"]');
       
      await page.waitForSelector('[data-testid="log-title"]');
      const usernameInput = await page.$('[data-testid="log-username"] input');
      const passwordInput = await page.$('[data-testid="log-password"] input');
      await usernameInput.type("testStats");
      await passwordInput.type("StrongPass123!");
      await expect(page).toClick('button[type="submit"]');
    });

    and("I haven't completed any game", async () => {
    });

    when("I click the stats button", async () => {
        await page.waitForSelector('[data-testid="stats-nav"]');
        await page.click('[data-testid="stats-nav"]');
    });

    then("I see the no stats information text", async () => {
        await page.waitForSelector('[data-testid="no-stats"]');
        await expect(await expectPageToContain("No hay estadísticas disponibles para este usuario.")).toBe(true);
        await expect(await expectPageToContain("¡Juega algunas partidas para ver tus estadísticas aquí!")).toBe(true);
    });
  });

  test("Stats are displayed when you have completed at least one game", ({
    given,
    and,
    when,
    then,
  }) => {
    given("I am logged in", async () => {
    });

    and("I have completed one game", async () => {
        // Enter game
        await page.waitForSelector('[data-testid="play-button"]');
        await page.click('[data-testid="play-button"]');

        await page.waitForSelector('[data-testid="game-mode-0"]');
        await page.click('[data-testid="game-mode-normal"]');

        await waitForQuestionToLoad();

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
    });

    when("I click the stats button", async () => {
        await page.waitForSelector('[data-testid="stats-nav"]');
        await page.click('[data-testid="stats-nav"]');
    });

    then("I see the stats from that game", async () => {
        await page.waitForSelector('[data-testid="stats-data"]');
        const gameCount = await page.$eval(
            '[data-testid="total-games"]',
            (el) => el.textContent
        );
        expect(parseInt(gameCount)).toBe(1);
    });
  });
});
