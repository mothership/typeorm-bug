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
Saving createdAt:   undefined 
Saving updatedAt:   undefined 
Saved createdAt:    2020-12-03T20:20:38.694Z
Saved updatedAt:    2020-12-03T20:20:38.694Z
Updated createdAt:  2020-12-03T20:20:38.694Z
Updated updatedAt:  2020-12-03T20:20:39.763Z

[Case 2]: With Transformer (fails)
Saving createdAt:   undefined 
Saving updatedAt:   undefined 
Saved createdAt:    1607026839756
Saved updatedAt:    1607026839756
Updated createdAt:  1607026839756
Updated updatedAt:  1607026839756
```

It appears as though using the transformer option results in typeorm _not_ updating the updatedAt 
column for us.  We'd expect to see the updated updatedAt be a second later.

