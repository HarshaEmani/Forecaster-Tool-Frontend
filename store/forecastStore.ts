// store/forecastStore.ts
import { defineStore } from "pinia";

interface ForecastEntry {
	target_timestamp: string;
	forecast_value: number;
	actual_value?: number;
}

export const useForecastStore = defineStore("forecast", {
	state: () => ({
		forecastsByFeeder: {} as Record<number, ForecastEntry[]>,
		selectedDates: [] as string[], // yyyy-MM-dd format
		selectedFeederId: null as number | null,
	}),
	getters: {
		filteredForecasts(state): ForecastEntry[] {
			if (!state.selectedFeederId) return [];
			const allForecasts = state.forecastsByFeeder[state.selectedFeederId] || [];
			if (!state.selectedDates.length) {
				return allForecasts.slice(-15); // default last 15 forecasts
			}
			return allForecasts.filter((f) => state.selectedDates.includes(f.target_timestamp.substring(0, 10)));
		},
	},
	actions: {
		setForecasts(feederId: number, forecasts: ForecastEntry[]) {
			this.forecastsByFeeder[feederId] = forecasts;
		},
		setSelectedDates(dates: string[]) {
			this.selectedDates = dates;
		},
		setSelectedFeederId(id: number) {
			this.selectedFeederId = id;
		},
	},
});
