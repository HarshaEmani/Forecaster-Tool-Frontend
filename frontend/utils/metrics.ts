// utils/metrics.ts
export interface ForecastRecord {
	forecast_value: number;
	actual_value?: number | null;
}

export function calculateMetrics(data: ForecastRecord[]) {
	const N = data.length;
	if (N === 0) {
		return {
			peakLoad: 0,
			minLoad: 0,
			averageLoad: 0,
			mae: 0,
			rmse: 0,
			smape: 0,
		};
	}

	// Build arrays of actuals (fall back to forecast if missing) and forecasts
	const actuals = data.map((d) => (d.actual_value != null ? d.actual_value : d.forecast_value));
	const forecasts = data.map((d) => d.forecast_value);

	// Peak and least
	const peakLoad = Math.max(...actuals);
	const minLoad = Math.min(...actuals);

	// Average
	const sumActuals = actuals.reduce((s, v) => s + v, 0);
	const averageLoad = sumActuals / N;

	// MAE
	const mae = actuals.map((a, i) => Math.abs(a - forecasts[i])).reduce((s, v) => s + v, 0) / N;

	// RMSE
	const rmse = Math.sqrt(actuals.map((a, i) => (a - forecasts[i]) ** 2).reduce((s, v) => s + v, 0) / N);

	// sMAPE
	const smape =
		(actuals
			.map((a, i) => {
				const f = forecasts[i];
				const denom = (Math.abs(a) + Math.abs(f)) / 2 || 1;
				return Math.abs(f - a) / denom;
			})
			.reduce((s, v) => s + v, 0) /
			N) *
		100;

	return { peakLoad, minLoad, averageLoad, mae, rmse, smape };
}
