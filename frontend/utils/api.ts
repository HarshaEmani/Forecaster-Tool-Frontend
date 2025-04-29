// utils/api.ts
import axios from "axios";
import { useRuntimeConfig } from "#app";

export async function fetchFeeders() {
	const config = useRuntimeConfig();
	const { data } = await axios.get(`${config.public.apiBase}/feeders`);
	return data.feeders;
}

export async function fetchForecasts(feederId: number) {
	const config = useRuntimeConfig();
	const { data } = await axios.get(`${config.public.apiBase}/forecasts/${feederId}`);
	return data.forecasts;
}
