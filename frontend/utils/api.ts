// utils/api.ts
import axios from "axios";

export async function fetchFeeders() {
	const config = useRuntimeConfig();
	console.log("NUXT_PUBLIC_API_BASE_URL inside api.ts:", config.public.apiBaseUrl);
	const { data } = await axios.get(`${config.public.apiBaseUrl}/feeders`);
	return data.feeders;
}

export async function fetchForecasts(feederId: number) {
	const config = useRuntimeConfig();
	console.log("NUXT_PUBLIC_API_BASE_URL inside api.ts:", config.public.apiBaseUrl);
	const { data } = await axios.get(`${config.public.apiBaseUrl}/forecasts/${feederId}`);
	return data.forecasts;
}
