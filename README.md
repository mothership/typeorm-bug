# TypeORM CreateDate column bug

This bug appears to not set a created at value automatically. To reproduce: 

In one terminal:

```bash
yarn docker:up --force-recreate -V
```

In another:

```
$ yarn install
$ yarn bug-one
```

You should see the following output:

```
[Case 1]: Does not set a default on save... (fails)
Saving createdAt:   undefined
Saving updatedAt:   undefined
(node:72779) UnhandledPromiseRejectionWarning: QueryFailedError: null value in column "created_at" violates not-null constraint
    at new QueryFailedError (/typeorm-bug/src/error/QueryFailedError.ts:9:9)
    at Query.<anonymous> (/typeorm-bug/src/driver/postgres/PostgresQueryRunner.ts:220:30)
    at Query.handleError (/typeorm-bug/node_modules/pg/lib/query.js:128:19)
    at Client._handleErrorMessage (/typeorm-bug/node_modules/pg/lib/client.js:335:17)
    at Connection.emit (events.js:198:13)
    at Connection.EventEmitter.emit (domain.js:448:20)
    at parse (/typeorm-bug/node_modules/pg/lib/connection.js:115:12)
    at Parser.parse (/typeorm-bug/node_modules/pg-protocol/src/parser.ts:102:9)
    at Socket.stream.on (/typeorm-bug/node_modules/pg-protocol/src/index.ts:7:48)
    at Socket.emit (events.js:198:13)
(node:72779) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:72779) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

TypeORM is NOT setting a default value for the created_at field.

# TypeORM UpdateDate column bug

UpdateDate fails to update if a transformer is being used on the column. To reproduce:

In one terminal:

```bash
yarn docker:up --force-recreate -V
```

In another:

```
$ yarn install
$ yarn bug-two
```

We can see the following output:

```
[Case 1]: Normal Baseline (should work)
Saving createdAt:   2020-12-03T20:20:38.694Z
Saving updatedAt:   2020-12-03T20:20:38.694Z
Saved createdAt:    2020-12-03T20:20:38.694Z
Saved updatedAt:    2020-12-03T20:20:38.694Z
Updated createdAt:  2020-12-03T20:20:38.694Z
Updated updatedAt:  2020-12-03T20:20:39.763Z

[Case 2]: With Transformer (fails)
Saving createdAt:   1607026839756
Saving updatedAt:   1607026839756
Saved createdAt:    1607026839756
Saved updatedAt:    1607026839756
Updated createdAt:  1607026839756
Updated updatedAt:  1607026839756
```

It appears as though using the transformer option results in typeorm _not_ updating the updatedAt 
column for us.  We'd expect to see the updated updatedAt be a second later.

