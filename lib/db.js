"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = exports.selectContainer = exports.database = void 0;
const function_1 = require("fp-ts/function");
const E = require("fp-ts/Either");
const R = require("fp-ts/Reader");
const cosmos_1 = require("@azure/cosmos");
const identity_1 = require("@azure/identity");
const config_1 = require("./config");
const defaultAzureCredential = new identity_1.DefaultAzureCredential();
exports.database = (0, function_1.pipe)(
  config_1.config,
  E.map((config) => {
    /*
    const client = new CosmosClient({
      endpoint: config.connectionString,
      aadCredentials: defaultAzureCredential,
    }); */
    const client = new cosmos_1.CosmosClient(
      "AccountEndpoint=https://mi-demo-db.documents.azure.com:443/;AccountKey=TA48ntE1tKQy2eA3w0LDSdB4Ez4NIKeq1ZO1GSwU8XxPJCfS0ESvcdwk0LesmeKQgIglVe5ddpb2movKIoxf1g==;"
    );
    return client.database(config.dbName);
  })
);
const selectContainer = (name) =>
  (0, function_1.pipe)(
    R.ask(),
    R.map((database) => database.container(name))
  );
exports.selectContainer = selectContainer;
const container = (containerId) =>
  (0, function_1.pipe)(
    exports.database,
    E.map((0, exports.selectContainer)(containerId))
  );
exports.container = container;
