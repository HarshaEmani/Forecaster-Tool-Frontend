// utils/api.ts
import axios from "axios";

export async function fetchFeeders() {
	const config = useRuntimeConfig();
	console.log("API Base URL:", config.public.apiBase); // ✅ Debug log

	const { data } = await axios.get(`${config.public.apiBase}/feeders`);
	return data.feeders;
}

export async function fetchForecasts(feederId: number) {
	const config = useRuntimeConfig();
	console.log("API Base URL:", config.public.apiBase); // ✅ Debug log

	const { data } = await axios.get(`${config.public.apiBase}/forecasts/${feederId}`);
	return data.forecasts;
}
