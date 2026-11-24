import type { MiddlewareObj } from '@middy/core'
import {
	formatTypeBoxErrors,
	validateWithTypeBox,
} from '@nrfcloud/validate-with-typebox'
import type { Static, StaticDecode, TSchema } from '@sinclair/typebox'
import type { ValueError } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'
import type {
	APIGatewayProxyEvent,
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
	Context,
} from 'aws-lambda'
import { parseHeaders } from './parseHeaders.ts'
import { tryAsJSON } from './tryAsJSON.ts'

export class ValidationFailedError extends Error {
	public readonly errors: ValueError[]
	constructor(errors: ValueError[], message = 'Validation failed') {
		super(message)
		this.errors = errors
		this.name = 'ValidationFailedError'
	}
}

/**
 * The event properties used by `validateInput` to construct the default input.
 *
 * Both REST API (v1, `APIGatewayProxyEvent`) and HTTP API (v2, `APIGatewayProxyEventV2`) events satisfy this.
 */
type ValidateInputEvent = Pick<
	APIGatewayProxyEvent | APIGatewayProxyEventV2,
	'headers' | 'body' | 'pathParameters' | 'queryStringParameters'
>

/**
 * Validates the input of a Lambda function.
 *
 * Use the `Event` type parameter to specify the type of the event passed
 * to `mapInput`, e.g. `validateInput<typeof Schema, APIGatewayProxyEvent>(Schema, (event) => ({ method: event.httpMethod }))`.
 * It is inferred from `mapInput` if its parameter is typed explicitly.
 */
export const validateInput = <
	Schema extends TSchema,
	Event extends ValidateInputEvent = APIGatewayProxyEventV2,
>(
	schema: Schema,
	mapInput?: (e: Event) => unknown,
): MiddlewareObj<
	Event,
	APIGatewayProxyStructuredResultV2,
	Error,
	Context & ValidInput<Schema>
> => {
	const v = validateWithTypeBox(schema)
	return {
		before: async (req) => {
			let reqBody = {}
			const headers = parseHeaders(req.event.headers)
			const contentType = headers.get('content-type') ?? ''
			if (
				contentType.includes('application/json') &&
				(req.event.body?.length ?? 0) >= 2 // should be at least '{}'
			) {
				reqBody = tryAsJSON(req.event.body) ?? {}
			}
			const input = mapInput?.(req.event) ?? {
				...(req.event.pathParameters ?? {}),
				...(req.event.queryStringParameters ?? {}),
				...reqBody,
			}
			console.debug(`[validateInput]`, 'input', JSON.stringify(input))
			const maybeValidInput = v(input)
			if ('errors' in maybeValidInput) {
				console.debug(
					`[validateInput]`,
					`Input not valid`,
					JSON.stringify({
						input,
						errors: formatTypeBoxErrors(maybeValidInput.errors),
					}),
					schema.title,
				)
				throw new ValidationFailedError(maybeValidInput.errors)
			}
			console.debug(`[validateInput]`, `Input is valid`, schema.title)
			req.context.validInput = maybeValidInput.value
			req.context.decodedInput = Value.Decode(schema, maybeValidInput.value)
			return undefined
		},
	}
}

export type ValidInput<Schema extends TSchema> = {
	/**
	 * @deprecated Use `decodedInput` instead
	 *
	 * This will be removed in the next major version.
	 */
	validInput: Static<Schema>
	decodedInput: StaticDecode<Schema>
}
