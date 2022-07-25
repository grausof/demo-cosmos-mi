"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = void 0;
const function_1 = require("fp-ts/function");
const http_1 = require("@pagopa/handler-kit/lib/http");
const errors_1 = require("@pagopa/handler-kit/lib/http/errors");
const tryToHttpResponse = (e) => {
  if (e.name === "UserNotFoundError") {
    return new errors_1.NotFoundError(e.message);
  }
  return e;
};
exports.errorResponse = (0, function_1.flow)(
  tryToHttpResponse,
  http_1.errorResponse
);
