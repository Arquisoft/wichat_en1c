const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const feature = loadFeature("./features/login-form.feature");

let page;
let browser;

const expectSnackbarToContain = async (text) => {
  await page.waitForSelector('div[role="alert"]');
  const snackbarMessage = await page.$eval('div[role="alert"]', (el) => el.textContent);
  expect(snackbarMessage).toContain(text);
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
    setDefaultOptions({ timeout: 10000 });

    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle0",
    });

    // Go to Register page to create user
    await page.waitForSelector('button[data-testid="register-nav"]');
    await page.click('button[data-testid="register-nav"]');

    // Register a new user for login
    const usernameInput = await page.$('[data-testid="reg-username"] input');
    const passwordInput = await page.$('[data-testid="reg-password"] input');
    await usernameInput.type("testlogin");
    await passwordInput.type("StrongPass123!");
    await expect(page).toClick('button[type="submit"]');

    await expectSnackbarToContain("User added successfully");

    // Should automatically redirect to login after registration
    await page.waitForSelector('[data-testid="log-username"] input');
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

    then("I should see a success message", async () => {
      await expectSnackbarToContain("Login successful");

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

    then("I should see an unauthorized error message", async () => {
      await expectSnackbarToContain("Unauthorized");
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

    then("I should see an unauthorized error message", async () => {
      await expectSnackbarToContain("Unauthorized");
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

    then("I should see an unauthorized error message", async () => {
      await expectSnackbarToContain("Unauthorized");
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

    then("I should see an unauthorized error message", async () => {
      await expectSnackbarToContain("Unauthorized");
    });
  });
});
