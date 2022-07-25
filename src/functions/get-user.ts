import * as t from "io-ts";

import { AzureFunction } from "@azure/functions";

import { pipe, flow } from "fp-ts/lib/function";
import { sequenceS } from "fp-ts/lib/Apply";
import * as RE from "fp-ts/lib/ReaderEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";

import { createHandler } from "@pagopa/handler-kit";
import { jsonResponse, HttpRequest, path } from "@pagopa/handler-kit/lib/http";
import * as azure from "@pagopa/handler-kit/lib/azure";
import {
  BadRequestError,
  NotFoundError,
} from "@pagopa/handler-kit/lib/http/errors";
import { errorResponse } from "../http";
import { getUser } from "../cosmos/users";
import { User } from "../user/user";

export const UserId = t.string;
export type UserId = t.TypeOf<typeof UserId>;

export const requireUserId: (req: HttpRequest) => E.Either<Error, User["id"]> =
  flow(
    path("userId"),
    E.fromOption(() => new BadRequestError("Missing userId in path")),
    E.chain(
      flow(
        UserId.decode,
        E.mapLeft(() => new BadRequestError("Invalid userId id"))
      )
    )
  );

export const extractGetUserPayload: RE.ReaderEither<
  HttpRequest,
  Error,
  { userId: User["id"] }
> = pipe(
  sequenceS(RE.Apply)({
    userId: requireUserId,
  })
);

const decodeRequest = flow(
  azure.fromHttpRequest,
  TE.chainEitherK(extractGetUserPayload)
);

const encodeSuccessResponse = flow(
  E.fromOption(() => new NotFoundError("User not found")),
  E.chainW(
    flow(
      User.decode,
      E.mapLeft(() => new Error("Serialization error"))
    )
  ),
  E.fold(errorResponse, jsonResponse)
);

export const run: AzureFunction = pipe(
  createHandler(
    decodeRequest,
    ({ userId }) => getUser(userId),
    errorResponse,
    encodeSuccessResponse
  ),
  azure.unsafeRun
);
