"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFoundError = exports.User = void 0;
const t = require("io-ts");
exports.User = t.type({
  id: t.string,
  name: t.string,
  surname: t.string,
});
class UserNotFoundError extends Error {
  constructor() {
    super("The specified user was not found");
    this.name = "UserNotFoundError";
  }
}
exports.UserNotFoundError = UserNotFoundError;
