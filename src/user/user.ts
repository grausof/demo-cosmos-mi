import * as t from "io-ts";

import { TaskEither } from "fp-ts/TaskEither";
import { Option } from "fp-ts/Option";

export const User = t.type({
  id: t.string,
  name: t.string,
  surname: t.string,
});
export type User = t.TypeOf<typeof User>;

export type AddUser = (user: User) => TaskEither<Error, User>;

export type GetUser = (id: User["id"]) => TaskEither<Error, Option<User>>;

export class UserNotFoundError extends Error {
  name = "UserNotFoundError";
  constructor() {
    super("The specified user was not found");
  }
}
