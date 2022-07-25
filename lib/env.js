"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFromNodeEnv = void 0;
const function_1 = require("fp-ts/function");
const Record_1 = require("fp-ts/Record");
const O = require("fp-ts/Option");
const E = require("fp-ts/Either");
const readFromNodeEnv = (key) => (env) =>
  (0, function_1.pipe)(
    env,
    (0, Record_1.lookup)(key),
    O.chain(O.fromNullable),
    E.fromOption(() => new Error(`unable to find "${key}" in node environment`))
  );
exports.readFromNodeEnv = readFromNodeEnv;
