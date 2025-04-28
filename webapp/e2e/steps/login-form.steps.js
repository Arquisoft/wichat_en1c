const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const feature = loadFeature("./features/login-form.feature");

let page;
let browser;

jest.setTimeout(300000);

const expectPageToContain = async (text) => {
  await page.waitForTimeout(2000);
  return (await page.content()).includes(text);
};

defineFeature(feature, (test) => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({
          headless: "new",
          args: ["--lang=es-ES,es", "--no-sandbox", "--disable-setuid-sandbox"],
        })
      : await puppeteer.launch({ headless: false, slowMo: 20, args: ["--lang=es-ES,es"] });

    page = await browser.newPage();
    setDefaultOptions({ timeout: 10000 });

    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle0",
    });

    // Wait for the language selector to be available
    await page.waitForSelector('div.MuiSelect-select'); 

    // Open the language dropdown
    await page.click('div.MuiSelect-select');

    // Select Spanish (ES)
    await page.waitForSelector('li[data-value="es"]');
    await page.click('li[data-value="es"]');

    // Go to Register page to create user
    await page.waitForSelector('button[data-testid="register-nav"]');
    await page.click('button[data-testid="register-nav"]');

    // Register a new user for login
    const usernameInput = await page.$('[data-testid="reg-username"] input');
    const passwordInput = await page.$('[data-testid="reg-password"] input');
    const confPasswordInput = await page.$('[data-testid="reg-confirm-password"] input');
    await usernameInput.type("testlogin");
    await passwordInput.type("StrongPass123!");
    await confPasswordInput.type("StrongPass123!");
    await expect(page).toClick('button[type="submit"]');

    await page.waitForSelector('button[data-testid="play-button"]');

    await page.waitForSelector('button[data-testid="logout-nav"]');
    await page.click('button[data-testid="logout-nav"]');

    await page.waitForSelector('button[data-testid="login-nav"]');
    await page.click('button[data-testid="login-nav"]');
  });

  afterAll(async () => {
    await browser.close();
  });

  afterEach(async () => {
    await page.waitForSelector('button[data-testid="home-nav"]');
    await page.click('button[data-testid="home-nav"]');

    await page.waitForSelector('button[data-testid="login-nav"]');
    await page.click('button[data-testid="login-nav"]');
  });

  test("Successful login with valid credentials", ({ given, when, then }) => {
    let username;
    let password;

    given("A registered user with valid credentials", async () => {
      username = "testlogin";
      password = "StrongPass123!";
    });

    when("I log in using the correct credentials", async () => {
      const usernameInput = await page.$('[data-testid="log-username"] input');
      const passwordInput = await page.$('[data-testid="log-password"] input');
      await usernameInput.type(username);
      await passwordInput.type(password);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I should be redirected to home", async () => {
      await page.waitForSelector('[data-testid="wichat-title"]');
      const currentUrl = page.url();
      expect(currentUrl).toBe("http://localhost:3000/");

      // Logout
      await page.waitForSelector('button[data-testid="logout-nav"]');
      await page.click('button[data-testid="logout-nav"]');
    });
  });

  test("Login with empty username", ({ given, when, then }) => {
    let password;

    given("A user with no username", async () => {
      password = "StrongPass123!";
    });

    when("I try to log in", async () => {
      const passwordInput = await page.$('[data-testid="log-password"] input');
      await passwordInput.type(password);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I shouldn't be able to login", async () => { // Empty fields are not counted as errors themselves, so I just check if we have not been redirected
      const currentUrl = page.url();
      expect(currentUrl).toBe("http://localhost:3000/login");
    });
  });

  test("Login with empty password", ({ given, when, then }) => {
    let username;

    given("A user with no password", async () => {
      username = "testlogin";
    });

    when("I try to log in", async () => {
      const usernameInput = await page.$('[data-testid="log-username"] input');
      await usernameInput.type(username);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I shouldn't be able to login", async () => {
      const currentUrl = page.url();
      expect(currentUrl).toBe("http://localhost:3000/login");
    });
  });

  test("Login with incorrect password", ({ given, when, then }) => {
    let username;
    let wrongPassword;

    given("A registered user with an incorrect password", async () => {
      username = "testlogin";
      wrongPassword = "WrongPass1!";
    });

    when("I try to log in", async () => {
      const usernameInput = await page.$('[data-testid="log-username"] input');
      const passwordInput = await page.$('[data-testid="log-password"] input');
      await usernameInput.type(username);
      await passwordInput.type(wrongPassword);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I should see a login error message", async () => {
      await expect(await expectPageToContain("Usuario o contraseña incorrectos")).toBe(true);
    });
  });

  test("Login with non-existing user", ({ given, when, then }) => {
    let username;
    let password;

    given("A non-existing username", async () => {
      username = "nonexistentuser";
      password = "DoesntMatter123!";
    });

    when("I try to log in", async () => {
      const usernameInput = await page.$('[data-testid="log-username"] input');
      const passwordInput = await page.$('[data-testid="log-password"] input');
      await usernameInput.type(username);
      await passwordInput.type(password);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I should see a login error message", async () => {
      await expect(await expectPageToContain("Usuario o contraseña incorrectos")).toBe(true);
    });
  });
});
