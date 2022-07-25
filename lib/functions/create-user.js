"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run =
  exports.extractCreateUserPayload =
  exports.CreateUserPayload =
    void 0;
const t = require("io-ts");
const ulid_1 = require("ulid");
const handler_kit_1 = require("@pagopa/handler-kit");
const http_1 = require("@pagopa/handler-kit/lib/http");
const azure = require("@pagopa/handler-kit/lib/azure");
const errors_1 = require("@pagopa/handler-kit/lib/http/errors");
const PathReporter_1 = require("io-ts/PathReporter");
const function_1 = require("fp-ts/lib/function");
const TE = require("fp-ts/lib/TaskEither");
const E = require("fp-ts/lib/Either");
const http_2 = require("../http");
const user_1 = require("../user/user");
const users_1 = require("../cosmos/users");
exports.CreateUserPayload = t.type({
  name: t.string,
  surname: t.string,
});
const createUser = (addUser) => (payload) =>
  (0, function_1.pipe)(
    TE.right({
      id: (0, ulid_1.ulid)(),
      name: payload.name,
      surname: payload.surname,
    }),
    TE.chainFirst(addUser)
  );
const requireUserBody = (req) =>
  (0, function_1.pipe)(
    exports.CreateUserPayload.decode(req.body),
    E.mapLeft(
      (0, function_1.flow)(
        PathReporter_1.failure,
        (errors) => errors.join("\n"),
        errors_1.badRequestError
      )
    )
  );
exports.extractCreateUserPayload = requireUserBody;
const decodeRequest = (0, function_1.flow)(
  azure.fromHttpRequest,
  TE.chainEitherK(exports.extractCreateUserPayload)
);
const encodeSuccessResponse = (0, function_1.flow)(
  user_1.User.decode,
  E.mapLeft(() => new Error("Serialization error")),
  E.fold(
    http_2.errorResponse,
    (0, function_1.flow)(http_1.jsonResponse, (0, http_1.withStatus)(201))
  )
);
exports.run = (0, function_1.pipe)(
  (0, handler_kit_1.createHandler)(
    decodeRequest,
    createUser(users_1.addUser),
    http_2.errorResponse,
    encodeSuccessResponse
  ),
  azure.unsafeRun
);
