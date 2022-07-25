"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.addUser = void 0;
const function_1 = require("fp-ts/function");
const E = require("fp-ts/Either");
const TE = require("fp-ts/TaskEither");
const cosmosdb_model_1 = require("@pagopa/io-functions-commons/dist/src/utils/cosmosdb_model");
const t = require("io-ts");
const strings_1 = require("@pagopa/ts-commons/lib/strings");
const db_1 = require("../db");
const user_1 = require("../user/user");
const NewUser = t.intersection([user_1.User, cosmosdb_model_1.BaseModel]);
const RetrievedUser = t.intersection([
  NewUser,
  cosmosdb_model_1.CosmosResource,
]);
const containerId = "users";
const partitionKey = "id";
class UserModel extends cosmosdb_model_1.CosmosdbModel {
  constructor(container) {
    super(container, NewUser, RetrievedUser);
  }
}
const userModel = (0, function_1.pipe)(
  (0, db_1.container)(containerId),
  E.map((c) => new UserModel(c))
);
const userModelTE = TE.fromEither(userModel);
const addUser = (user) =>
  (0, function_1.pipe)(
    NewUser.decode(user),
    E.mapLeft(() => new Error("Invalid user")),
    TE.fromEither,
    TE.chain((newUser) =>
      (0, function_1.pipe)(
        userModelTE,
        TE.chain((model) =>
          (0, function_1.pipe)(
            model.create(newUser),
            TE.mapLeft(() => new Error("Error creating the user"))
          )
        )
      )
    )
  );
exports.addUser = addUser;
const getUser = (id) =>
  (0, function_1.pipe)(
    strings_1.NonEmptyString.decode(id),
    E.mapLeft(() => new Error("Invalid User Id")),
    TE.fromEither,
    TE.chain((id) =>
      (0, function_1.pipe)(
        userModelTE,
        TE.chain((model) =>
          (0, function_1.pipe)(
            model.find([id]),
            TE.mapLeft(() => new Error("Error getting the user"))
          )
        )
      )
    )
  );
exports.getUser = getUser;
