# `@nrfcloud/lambda-helpers`

<https://jsr.io/@nrfcloud/lambda-helpers>

Helper functions for AWS Lambda functions used in nRF Cloud.

## Install with NPM

```bash
npx jsr add (--save-prod|--save-dev) @nrfcloud/lambda-helpers
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
