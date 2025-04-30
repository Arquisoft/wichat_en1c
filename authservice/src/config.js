// @ts-check
const argon2 = require("argon2");
const pkg = require("../package.json");

module.exports = {
  name: `${pkg.name}@${pkg.version}`,
  port: Number(process.env.PORT ?? 8002),
  mongoUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/wichat",
  /**
   * @see https://www.npmjs.com/package/jsonwebtoken
   * @see https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#jwt
   */
  jwt: {
    /**
     * @type {import("jsonwebtoken").SignOptions}
     */
    opts: {
      expiresIn: "1h",
      issuer: "wic",
      audience: "usr",
    },
    secret: process.env.JWT_SECRET ?? "secret",
  },
  /**
   * @see https://www.npmjs.com/package/argon2
   * @see https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id
   * @type {import("argon2").Options}
   */
  crypt: {
    type: argon2.argon2id,
    memoryCost: 12_288,
    timeCost: 3,
    parallelism: 1,
    secret: Buffer.from(process.env.CRYPT_SECRET ?? "secret"),
  },
  /**
   * @see https://www.npmjs.com/package/express-validator
   * @see https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#implement-proper-password-strength-controls
   * @type {import("validator").StrongPasswordOptions}
   */
  pass: {},
};
