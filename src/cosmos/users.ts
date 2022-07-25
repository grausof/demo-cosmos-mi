import { pipe } from "fp-ts/function";

import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";

import {
  BaseModel,
  CosmosdbModel,
  CosmosResource,
} from "@pagopa/io-functions-commons/dist/src/utils/cosmosdb_model";

import * as t from "io-ts";
import { Container } from "@azure/cosmos";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";

import { container } from "../db";
import { User, AddUser, GetUser } from "../user/user";

const NewUser = t.intersection([User, BaseModel]);
type NewUser = t.TypeOf<typeof NewUser>;

const RetrievedUser = t.intersection([NewUser, CosmosResource]);
type RetrievedUser = t.TypeOf<typeof RetrievedUser>;

const containerId = "users";
const partitionKey = "id";

class UserModel extends CosmosdbModel<
  User,
  NewUser,
  RetrievedUser,
  typeof partitionKey
> {
  constructor(container: Container) {
    super(container, NewUser, RetrievedUser);
  }
}

const userModel = pipe(
  container(containerId),
  E.map((c) => new UserModel(c))
);
const userModelTE = TE.fromEither(userModel);

export const addUser: AddUser = (user) =>
  pipe(
    NewUser.decode(user),
    E.mapLeft(() => new Error("Invalid user")),
    TE.fromEither,
    TE.chain((newUser) =>
      pipe(
        userModelTE,
        TE.chain((model) =>
          pipe(
            model.create(newUser),
            TE.mapLeft(() => new Error("Error creating the user"))
          )
        )
      )
    )
  );

export const getUser: GetUser = (id) =>
  pipe(
    NonEmptyString.decode(id),
    E.mapLeft(() => new Error("Invalid User Id")),
    TE.fromEither,
    TE.chain((id) =>
      pipe(
        userModelTE,
        TE.chain((model) =>
          pipe(
            model.find([id]),
            TE.mapLeft(() => new Error("Error getting the user"))
          )
        )
      )
    )
  );
