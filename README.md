# `@nrfcloud/lambda-helpers`

<https://github.com/nRFCloud/lambda-helpers/pkgs/npm/lambda-helpers>

Helper functions for AWS Lambda functions used in nRF Cloud.

## Installation

The package is published to the
[GitHub Packages registry](https://github.com/nRFCloud/lambda-helpers/pkgs/npm/lambda-helpers).
Releases are also published to
[npm](https://www.npmjs.com/package/@nrfcloud/lambda-helpers).

To install it, point the `@nrfcloud` scope to it in your project's `.npmrc` and
[authenticate](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages)
with a token that has the `read:packages` scope:

```
@nrfcloud:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm i (--save-prod|--save-dev) @nrfcloud/lambda-helpers
```

## Usage

```typescript
import { MetricUnit } from "@aws-lambda-powertools/metrics";
import { logMetrics } from "@aws-lambda-powertools/metrics/middleware";
import middy from "@middy/core";
import { metricsForComponent } from "@nrfcloud/lambda-helpers";

const { track, metrics } = metricsForComponent("my-function", "my-service");

export const handler = middy()
  .use(logMetrics(metrics))
  .handler(async () => {
    track("some:metric", MetricUnit.Count, 1);
  });
```

## TypeScript 6 and 7

This repo
[runs TypeScript 6 and 7 side by side](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0),
[so that eslint works](https://github.com/typescript-eslint/typescript-eslint/issues/10940#issuecomment-4922812181).
