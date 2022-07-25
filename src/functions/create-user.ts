import * as t from "io-ts";

import { AzureFunction } from "@azure/functions";
import { ulid } from "ulid";
import { createHandler } from "@pagopa/handler-kit";
import {
  jsonResponse,
  HttpRequest,
  withStatus,
} from "@pagopa/handler-kit/lib/http";
import * as azure from "@pagopa/handler-kit/lib/azure";

import { badRequestError } from "@pagopa/handler-kit/lib/http/errors";
import { failure } from "io-ts/PathReporter";
import { pipe, flow } from "fp-ts/lib/function";

import * as RE from "fp-ts/lib/ReaderEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";

import { errorResponse } from "../http";

import { AddUser, User } from "../user/user";
import { addUser } from "../cosmos/users";

export const CreateUserPayload = t.type({
  name: t.string,
  surname: t.string,
});
export type CreateUserPayload = t.TypeOf<typeof CreateUserPayload>;

const createUser =
  (addUser: AddUser) =>
  (payload: CreateUserPayload): TE.TaskEither<Error, User> =>
    pipe(
      TE.right({
        id: ulid(),
        name: payload.name,
        surname: payload.surname,
      }),
      TE.chainFirst(addUser)
    );

const requireUserBody = (
  req: HttpRequest
): E.Either<Error, CreateUserPayload> =>
  pipe(
    CreateUserPayload.decode(req.body),
    E.mapLeft(flow(failure, (errors) => errors.join("\n"), badRequestError))
  );

export const extractCreateUserPayload: RE.ReaderEither<
  HttpRequest,
  Error,
  CreateUserPayload
> = requireUserBody;

const decodeRequest = flow(
  azure.fromHttpRequest,
  TE.chainEitherK(extractCreateUserPayload)
);

const encodeSuccessResponse = flow(
  User.decode,
  E.mapLeft(() => new Error("Serialization error")),
  E.fold(errorResponse, flow(jsonResponse, withStatus(201)))
);

export const run: AzureFunction = pipe(
  createHandler(
    decodeRequest,
    createUser(addUser),
    errorResponse,
    encodeSuccessResponse
  ),
  azure.unsafeRun
);
