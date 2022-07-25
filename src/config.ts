import * as t from "io-ts";

import * as RE from "fp-ts/ReaderEither";
import { sequenceS } from "fp-ts/lib/Apply";

import { readFromNodeEnv } from "./env";

export const CosmosConfig = t.type({
  connectionString: t.string,
  dbName: t.string,
});

export type CosmosConfig = t.TypeOf<typeof CosmosConfig>;

export const getCosmosConfigFromEnvironment: RE.ReaderEither<
  NodeJS.ProcessEnv,
  Error,
  CosmosConfig
> = sequenceS(RE.Apply)({
  connectionString: readFromNodeEnv("CosmosDbEndpoint"),
  dbName: readFromNodeEnv("CosmosDbDatabaseName"),
});

export const config = getCosmosConfigFromEnvironment(process.env);
