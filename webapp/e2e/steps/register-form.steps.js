const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const feature = loadFeature("./features/register-form.feature");

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
          slowMo: 20,
        })
      : await puppeteer.launch({ headless: false, slowMo: 20, args: ["--lang=es-ES,es"] });
    page = await browser.newPage();
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

  test("Register with valid, new credentials", ({ given, when, then, and }) => {
    let username;
    let password;

    given("An unregistered user with valid credentials", async () => {
      username = "testuser";
      password = "StrongPass123!";
    });

    when("I fill in the register form and submit", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const passwordInput = await page.$('[data-testid="reg-password"] input');
      const confPasswordInput = await page.$('[data-testid="reg-confirm-password"] input');

      await usernameInput.type(username);
      await passwordInput.type(password);
      await confPasswordInput.type(password);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I should be redirected to home", async () => {
      await page.waitForSelector('[data-testid="wichat-title"]');
      const currentUrl = page.url();
      expect(currentUrl).toBe("http://localhost:3000/");
    });

    and("I should be logged in", async () => {
      await expect(await expectPageToContain("¡Hola, testuser!")).toBe(true);

      await page.waitForSelector('button[data-testid="logout-nav"]');
      await page.click('button[data-testid="logout-nav"]');
    });
  });

  test("Registering an existing user", ({ given, when, then, and }) => { 
    let existingUsername;
    let password;

    given("A user that already exists", async () => {
      existingUsername = "testuser";
      password = "StrongPass123!";
    });

    when("I try to register again with the same username", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const passwordInput = await page.$('[data-testid="reg-password"] input');
      const confPasswordInput = await page.$('[data-testid="reg-confirm-password"] input');

      await usernameInput.type(existingUsername);
      await passwordInput.type(password);
      await confPasswordInput.type(password);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I should be redirected to login", async () => {
      await page.waitForSelector('[data-testid="log-title"]');
      const currentUrl = page.url();
      expect(currentUrl).toContain("/login");
    });

    and("I should see an error message", async () => {
      await expect(await expectPageToContain("¡Vaya! Algo salió mal.")).toBe(true);
    });
  }, 300000);

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
      const confPasswordInput = await page.$('[data-testid="reg-confirm-password"] input');

      await usernameInput.type(shortUsername);
      await passwordInput.type(password);
      await confPasswordInput.type(password);
  
      await expect(await expectPageToContain("Debe tener entre 5 y 20 caracteres y ser alfanumérico")).toBe(true);

      await expect(page).toClick('button[type="submit"]');
    });

    then("I shouldn't be able to register", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const ariaInvalid = await usernameInput.evaluate(el => el.getAttribute('aria-invalid'));
      await expect(ariaInvalid).toBe('true')
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
      const confPasswordInput = await page.$('[data-testid="reg-confirm-password"] input');

      await usernameInput.type(longUsername);
      await passwordInput.type(password);
      await confPasswordInput.type(password);

      await expect(await expectPageToContain("Debe tener entre 5 y 20 caracteres y ser alfanumérico")).toBe(true);

      await expect(page).toClick('button[type="submit"]');
    });

    then("I shouldn't be able to register", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const ariaInvalid = await usernameInput.evaluate(el => el.getAttribute('aria-invalid'));
      await expect(ariaInvalid).toBe('true')
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
      const confPasswordInput = await page.$('[data-testid="reg-confirm-password"] input');

      await usernameInput.type(invalidUsername);
      await passwordInput.type(password);
      await confPasswordInput.type(password);

      await expect(await expectPageToContain("Debe tener entre 5 y 20 caracteres y ser alfanumérico")).toBe(true);

      await expect(page).toClick('button[type="submit"]');
    });

    then("I shouldn't be able to register", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const ariaInvalid = await usernameInput.evaluate(el => el.getAttribute('aria-invalid'));
      await expect(ariaInvalid).toBe('true')
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
      const confPasswordInput = await page.$('[data-testid="reg-confirm-password"] input');

      await usernameInput.type(emptyUsername);
      await passwordInput.type(password);
      await confPasswordInput.type(password);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I shouldn't be able to register", async () => { // With empty fields, the aria-inavalid is not marked as true
      const currentUrl = page.url();
      expect(currentUrl).toBe("http://localhost:3000/register");
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
      const confPasswordInput = await page.$('[data-testid="reg-confirm-password"] input');

      await usernameInput.type(username);
      await passwordInput.type(emptyPassword);
      await confPasswordInput.type(username);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I shouldn't be able to register", async () => {
      const currentUrl = page.url();
      expect(currentUrl).toBe("http://localhost:3000/register");
    });
  });

  test("Registering with invalid data - Empty confirm password", ({ given, when, then }) => {
    let username;
    let emptyPassword;
    let password;

    given("A user with an empty confirm password", async () => {
      username = "ValidUser";
      emptyPassword = "";
      password = "StrongPass123!";
    });

    when("I try to register", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const passwordInput = await page.$('[data-testid="reg-password"] input');
      const confPasswordInput = await page.$('[data-testid="reg-confirm-password"] input');

      await usernameInput.type(username);
      await passwordInput.type(password);
      await confPasswordInput.type(emptyPassword);
      await expect(page).toClick('button[type="submit"]');
    });

    then("I shouldn't be able to register", async () => {
      const currentUrl = page.url();
      expect(currentUrl).toBe("http://localhost:3000/register");
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
      const confPasswordInput = await page.$('[data-testid="reg-confirm-password"] input');

      await usernameInput.type(username);
      await passwordInput.type(weakPassword);
      await confPasswordInput.type(weakPassword);

      await expect(await expectPageToContain("Debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos")).toBe(true);
      
      await expect(page).toClick('button[type="submit"]');
    });

    then("I shouldn't be able to register", async () => {
      const passwordInput = await page.$('[data-testid="reg-password"] input');
      const ariaInvalid = await passwordInput.evaluate(el => el.getAttribute('aria-invalid'));
      await expect(ariaInvalid).toBe('true')
    });
  });

  test("Registering with invalid data - Not matching confirm password", ({ given, when, then }) => {
    let username;
    let password;
    let confPassword;

    given("A user with passwords not matching", async () => {
      username = "goodUsername";
      password = "StrongPass123!";
      confPassword = "notMatching-1";
    });

    when("I try to register", async () => {
      const usernameInput = await page.$('[data-testid="reg-username"] input');
      const passwordInput = await page.$('[data-testid="reg-password"] input');
      const confPasswordInput = await page.$('[data-testid="reg-confirm-password"] input');

      await usernameInput.type(username);
      await passwordInput.type(password);
      await confPasswordInput.type(confPassword);

      await expect(await expectPageToContain("Las contraseñas deben coincidir")).toBe(true);

      await expect(page).toClick('button[type="submit"]');
    });

    then("I shouldn't be able to register", async () => {
      const confPasswordInput = await page.$('[data-testid="reg-confirm-password"] input');
      const ariaInvalid = await confPasswordInput.evaluate(el => el.getAttribute('aria-invalid'));
      await expect(ariaInvalid).toBe('true')
    });
  });
});
