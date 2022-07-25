# demo-cosmos-mi

## <a name="installation-and-usage"></a>Installation and Usage

Prerequisites:

- [Node.js](https://nodejs.org/) 
- [yarn](https://yarnpkg.com/) 

Install dependencies using `npm`

```sh
yarn install
```

And create the `local.settings.json` file with the following content

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "CosmosDbEndpoint": "HERE-THE-COSMOS-ENDPOINT",
    "CosmosDbDatabaseName": "HERE-THE-COSMOS-DB-NAME"
  }
}
```

Now you can build the TypeScript sources using

```sh
yarn build
```

And run the project with

```sh
yarn start
```

#### Cosmos DB

Create a container named ```users``` with Partition key ```/id```
