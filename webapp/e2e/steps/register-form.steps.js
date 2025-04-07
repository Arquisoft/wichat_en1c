const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const feature = loadFeature("./features/register-form.feature");

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
    // Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 });

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});

    // Wait for the navbar and click the "Register" button
    await page.waitForSelector('button[data-testid="register-nav"]');
    await page.click('button[data-testid="register-nav"]');

  });

  afterAll(async () => {
    await browser.close();
  });

  afterEach(async () => {
    // Navigate to home to clear register inputs
    await page.waitForSelector('button[data-testid="home-nav"]');
    await page.click('button[data-testid="home-nav"]');
    // Navigate back to the register page after each test
    await page.waitForSelector('button[data-testid="register-nav"]');
    await page.click('button[data-testid="register-nav"]');
  });

  test("Register with valid, new credentials", ({ given, when, then }) => {
    let username;
    let password;

    given("An unregistered user with valid credentials", async () => {
      username = "testuser";
      password = "StrongPass123!";
    });

    when("I fill in the register form and submit", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const passwordInput = await page.$('[data-testid="reg-password"] input');

      await usernameInput.type(username);
      await passwordInput.type(password);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I should see a success message", async () => {
      expectSnackbarToContain("User added successfully");
    });
  });

  test("Registering an existing user", ({ given, when, then }) => {
    let existingUsername;
    let password;

    given("A user that already exists", async () => {
      existingUsername = "testuser";
      password = "StrongPass123!";
    });

    when("I try to register again with the same username", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const passwordInput = await page.$('[data-testid="reg-password"] input');

      await usernameInput.type(existingUsername);
      await passwordInput.type(password);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I should see an unauthorized error message", async () => {
      expectSnackbarToContain("Unauthorized");
    });
  });

  test("Registering with invalid data - Short username", ({ given, when, then }) => {
    let shortUsername;
    let password;

    given("A user with a short invalid username", async () => {
      shortUsername = "abcd"; // 4 characters
      password = "StrongPass123!";
    });

    when("I try to register", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const passwordInput = await page.$('[data-testid="reg-password"] input');

      await usernameInput.type(shortUsername);
      await passwordInput.type(password);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I should see a bad request error message", async () => {
      expectSnackbarToContain("Bad Request");
    });
  });

  test("Registering with invalid data - Long username", ({ given, when, then }) => {
    let longUsername;
    let password;

    given("A user with a long invalid username", async () => {
      longUsername = "ReallyLongUsername111"; // 21 characters
      password = "StrongPass123!";
    });

    when("I try to register", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const passwordInput = await page.$('[data-testid="reg-password"] input');

      await usernameInput.type(longUsername);
      await passwordInput.type(password);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I should see a bad request error message", async () => {
      expectSnackbarToContain("Bad Request");
    });
  });

  test("Registering with invalid data - Non-alphanumeric username", ({ given, when, then }) => {
    let invalidUsername;
    let password;

    given("A user with special characters in the username", async () => {
      invalidUsername = "user!@#";
      password = "StrongPass123!";
    });

    when("I try to register", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const passwordInput = await page.$('[data-testid="reg-password"] input');

      await usernameInput.type(invalidUsername);
      await passwordInput.type(password);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I should see a bad request error message", async () => {
      expectSnackbarToContain("Bad Request");
    });
  });

  test("Registering with invalid data - Empty username", ({ given, when, then }) => {
    let emptyUsername;
    let password;

    given("A user with an empty username", async () => {
      emptyUsername = "";
      password = "StrongPass123!";
    });

    when("I try to register", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const passwordInput = await page.$('[data-testid="reg-password"] input');

      await usernameInput.type(emptyUsername);
      await passwordInput.type(password);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I should see a bad request error message", async () => {
      expectSnackbarToContain("Bad Request");
    });
  });

  test("Registering with invalid data - Empty password", ({ given, when, then }) => {
    let username;
    let emptyPassword;

    given("A user with an empty password", async () => {
      username = "ValidUser";
      emptyPassword = "";
    });

    when("I try to register", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const passwordInput = await page.$('[data-testid="reg-password"] input');

      await usernameInput.type(username);
      await passwordInput.type(emptyPassword);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I should see a bad request error message", async () => {
      expectSnackbarToContain("Bad Request");
    });
  });

  test("Registering with invalid data - Weak password", ({ given, when, then }) => {
    let username;
    let weakPassword;

    given("A user with a weak password", async () => {
      username = "goodUsername";
      weakPassword = "weak";
    });

    when("I try to register", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const passwordInput = await page.$('[data-testid="reg-password"] input');

      await usernameInput.type(username);
      await passwordInput.type(weakPassword);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I should see a bad request error message", async () => {
      expectSnackbarToContain("Bad Request");
    });
  });
});
