import {
	Context as ProblemDetailContext,
	type ProblemDetail,
} from '@nrfcloud/problem-detail'
import type { Static } from '@sinclair/typebox'
import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'

export const aProblem = (
	problem: Omit<Static<typeof ProblemDetail>, '@context'>,
	cacheForSeconds: number = 0,
): APIGatewayProxyStructuredResultV2 => ({
	statusCode: problem.status,
	headers: {
		'content-type': 'application/problem+json',
		'Cache-Control':
			cacheForSeconds > 0 ? `public, max-age=${cacheForSeconds}` : 'no-store',
	},
	body: JSON.stringify({
		'@context': ProblemDetailContext,
		...problem,
	}),
})
