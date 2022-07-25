import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as R from "fp-ts/Reader";

import { CosmosClient, Database } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";

import { config } from "./config";

const defaultAzureCredential = new DefaultAzureCredential();

export const database: E.Either<Error, Database> = pipe(
  config,
  E.map((config) => {
    const client = new CosmosClient({
      endpoint: config.connectionString,
      aadCredentials: defaultAzureCredential,
    });
    return client.database(config.dbName);
  })
);

export const selectContainer = (name: string) =>
  pipe(
    R.ask<Database>(),
    R.map((database) => database.container(name))
  );

export const container = (containerId: string) =>
  pipe(database, E.map(selectContainer(containerId)));
