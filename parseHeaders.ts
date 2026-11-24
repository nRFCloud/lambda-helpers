/**
 * Returns case-insensitive headers (a `Headers` instance).
 *
 * `undefined` values are skipped, and entries that are not valid HTTP headers
 * are ignored instead of throwing.
 */
export const parseHeaders = (
	headers: Record<string, string | undefined> | null | undefined,
): ParsedHeaders => {
	const parsed = new Headers()
	for (const [key, value] of Object.entries(headers ?? {})) {
		if (value === undefined || value === null) continue
		try {
			parsed.set(key, value)
		} catch {
			// Ignore invalid header names or values
		}
	}
	return parsed
}

export type ParsedHeaders = Pick<
	Headers,
	'get' | 'has' | 'keys' | 'values' | 'entries' | 'forEach'
>
