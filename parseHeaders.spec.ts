import assert from 'assert'
import { describe, it } from 'node:test'
import { parseHeaders } from './parseHeaders.ts'

void describe('parseHeaders()', () => {
	void it('should parse both lowercase and uppercase headers', () => {
		const headers = {
			'content-type': 'application/json',
			'Content-Length': '1234',
			'x-custom-header': 'value',
		}

		const parsedHeaders = parseHeaders(headers)

		assert.deepEqual(
			new Map(parsedHeaders.entries()),
			new Map([
				['content-type', 'application/json'],
				['content-length', '1234'],
				['x-custom-header', 'value'],
			]),
		)
	})

	void it('should handle null headers', () =>
		assert.deepEqual([...parseHeaders(null).entries()], []))

	void it('should skip undefined values', () => {
		const parsedHeaders = parseHeaders({ a: undefined, b: 'x' })
		assert.equal(parsedHeaders.has('a'), false)
		assert.equal(parsedHeaders.get('b'), 'x')
	})

	void it('should ignore invalid headers', () => {
		const parsedHeaders = parseHeaders({ 'not valid': 'x', b: 'y' })
		assert.deepEqual([...parsedHeaders.keys()], ['b'])
	})

	void it('should make header keys case-insensitive', () => {
		const headers = {
			'x-custom-header': 'value',
		}
		const parsedHeaders = parseHeaders(headers)
		assert.equal(parsedHeaders.get('X-Custom-HEADER'), 'value')
	})
})
