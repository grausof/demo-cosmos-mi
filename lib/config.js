"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config =
  exports.getCosmosConfigFromEnvironment =
  exports.CosmosConfig =
    void 0;
const t = require("io-ts");
const RE = require("fp-ts/ReaderEither");
const Apply_1 = require("fp-ts/lib/Apply");
const env_1 = require("./env");
exports.CosmosConfig = t.type({
  connectionString: t.string,
  dbName: t.string,
});
exports.getCosmosConfigFromEnvironment = (0, Apply_1.sequenceS)(RE.Apply)({
  connectionString: (0, env_1.readFromNodeEnv)("CosmosDbEndpoint"),
  dbName: (0, env_1.readFromNodeEnv)("CosmosDbDatabaseName"),
});
exports.config = (0, exports.getCosmosConfigFromEnvironment)(process.env);
