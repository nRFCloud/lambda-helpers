import middy from '@middy/core'
import { Type } from '@sinclair/typebox'
import type {
	APIGatewayProxyEvent,
	APIGatewayProxyEventV2,
	Context,
} from 'aws-lambda'
import assert from 'node:assert'
import { describe, it } from 'node:test'
import {
	validateInput,
	ValidationFailedError,
	type ValidInput,
} from './validateInput.ts'

void describe('validateInput()', () => {
	void it('should validate the default input from path, query, and body', async () => {
		const Schema = Type.Object({
			id: Type.String(),
			filter: Type.String(),
			value: Type.Boolean(),
		})
		assert.deepEqual(
			await middy()
				.use(validateInput(Schema))
				.handler(
					async (_, context: ValidInput<typeof Schema> & Context) =>
						context.decodedInput,
				)(
				{
					headers: { 'Content-Type': 'application/json' },
					pathParameters: { id: '42' },
					queryStringParameters: { filter: 'foo' },
					body: JSON.stringify({ value: true }),
				} as unknown as APIGatewayProxyEventV2,
				{} as never, // middy augments the Context
			),
			{ id: '42', filter: 'foo', value: true },
		)
	})

	void it('should pass the event to mapInput()', async () => {
		const Schema = Type.Object({
			method: Type.Literal('DELETE'),
		})
		assert.deepEqual(
			await middy()
				.use(
					validateInput(Schema, (event: APIGatewayProxyEvent) => ({
						method: event.httpMethod,
					})),
				)
				.handler(
					async (_, context: ValidInput<typeof Schema> & Context) =>
						context.decodedInput,
				)(
				{
					headers: {},
					httpMethod: 'DELETE',
				} as unknown as APIGatewayProxyEvent,
				{} as never, // middy augments the Context
			),
			{ method: 'DELETE' },
		)
	})

	void it('should throw an Error in case the input is invalid', async () =>
		assert.rejects(
			async () =>
				middy()
					.use(validateInput(Type.Object({ id: Type.Number() })))
					.handler(async () => undefined)(
					{
						headers: {},
						pathParameters: { id: 'not-a-number' },
					} as unknown as APIGatewayProxyEventV2,
					{} as never, // middy augments the Context
				),
			ValidationFailedError,
		))
})
