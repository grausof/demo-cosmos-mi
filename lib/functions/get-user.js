"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run =
  exports.extractGetUserPayload =
  exports.requireUserId =
  exports.UserId =
    void 0;
const t = require("io-ts");
const function_1 = require("fp-ts/lib/function");
const Apply_1 = require("fp-ts/lib/Apply");
const RE = require("fp-ts/lib/ReaderEither");
const TE = require("fp-ts/lib/TaskEither");
const E = require("fp-ts/lib/Either");
const handler_kit_1 = require("@pagopa/handler-kit");
const http_1 = require("@pagopa/handler-kit/lib/http");
const http_2 = require("../http");
const azure = require("@pagopa/handler-kit/lib/azure");
const errors_1 = require("@pagopa/handler-kit/lib/http/errors");
const users_1 = require("../cosmos/users");
const user_1 = require("../user/user");
exports.UserId = t.string;
exports.requireUserId = (0, function_1.flow)(
  (0, http_1.path)("userId"),
  E.fromOption(() => new errors_1.BadRequestError("Missing userId in path")),
  E.chain(
    (0, function_1.flow)(
      exports.UserId.decode,
      E.mapLeft(() => new errors_1.BadRequestError("Invalid userId id"))
    )
  )
);
exports.extractGetUserPayload = (0, function_1.pipe)(
  (0, Apply_1.sequenceS)(RE.Apply)({
    userId: exports.requireUserId,
  })
);
const decodeRequest = (0, function_1.flow)(
  azure.fromHttpRequest,
  TE.chainEitherK(exports.extractGetUserPayload)
);
const encodeSuccessResponse = (0, function_1.flow)(
  E.fromOption(() => new errors_1.NotFoundError("User not found")),
  E.chainW(
    (0, function_1.flow)(
      user_1.User.decode,
      E.mapLeft(() => new Error("Serialization error"))
    )
  ),
  E.fold(http_2.errorResponse, http_1.jsonResponse)
);
exports.run = (0, function_1.pipe)(
  (0, handler_kit_1.createHandler)(
    decodeRequest,
    ({ userId }) => (0, users_1.getUser)(userId),
    http_2.errorResponse,
    encodeSuccessResponse
  ),
  azure.unsafeRun
);
