import { Metrics } from '@aws-lambda-powertools/metrics'

const registry: Record<string, Metrics> = {}
export type AddMetricsFn = (...args: Parameters<Metrics['addMetric']>) => void

/**
 * Manages the instantiation of a Metrics object (unless Metrics are disabled)
 */
export const metricsForComponent = (
	component: string,
	namespace = 'nrfcloud',
): {
	metrics: Metrics
	track: AddMetricsFn
} => {
	const metricsEnabled = process.env.DISABLE_METRICS !== '1'
	if (registry[component] === undefined) {
		console.debug(`[Metrics]`, metricsEnabled ? `Enabled` : `Disabled`)
		registry[component] = new Metrics({
			namespace,
			serviceName: component,
		})
	}
	const metrics = registry[component]
	return {
		metrics,
		track: (...args) => {
			if (!metricsEnabled) {
				return
			}
			metrics.addMetric(...args)
		},
	}
}
