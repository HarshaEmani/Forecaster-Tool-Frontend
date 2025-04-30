// utils/api.ts
import axios from "axios";
import { useRuntimeConfig } from "#app";

// Grab your public runtime config once
const runtime = useRuntimeConfig();

// 1) Create a single axios instance configured with baseURL & timeout
const api = axios.create({
	baseURL: runtime.public.apiBase,
	timeout: 60000, // 60 seconds
});

// 2) Log every outgoing request
api.interceptors.request.use((req) => {
	console.log(`%c[API] →`, "color: #0b79d0; font-weight: bold", req.method?.toUpperCase(), req.baseURL + req.url, req.params || "", req.data || "");
	return req;
});

// 3) Log every response or error
api.interceptors.response.use(
	(res) => {
		console.log(`%c[API] ←`, "color: #22863a; font-weight: bold", res.status, res.config.url);
		return res;
	},
	(err) => {
		console.error(`%c[API] ✗`, "color: #d73a49; font-weight: bold", err.code, err.message, err.config?.url);
		return Promise.reject(err);
	}
);

// 4) Your existing fetchers, now using our logged instance
export async function fetchFeeders() {
	const { data } = await api.get<{ feeders: number[] }>("/feeders");
	return data.feeders;
}

export async function fetchForecasts(feederId: number) {
	const { data } = await api.get<{ forecasts: any[] }>(`/forecasts/${feederId}`);
	return data.forecasts;
}
