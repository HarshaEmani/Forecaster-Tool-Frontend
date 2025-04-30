// nuxt.config.ts
import { config as loadEnv } from "dotenv";
import { resolve } from "path";

// Manually load env file from one directory up
loadEnv({ path: resolve(__dirname, "../.env") });

import Aura from "@primeuix/themes/aura";
import Material from "@primeuix/themes/material";
import Lara from "@primeuix/themes/lara";

export default defineNuxtConfig({
	modules: ["@primevue/nuxt-module", "@pinia/nuxt", "@vueuse/nuxt"],
	css: ["primeflex/primeflex.css", "primeicons/primeicons.css", "@/assets/tailwind.css"],
	plugins: [
		// load your custom theme preset
		// "~/plugins/my-custom-theme.ts",
	],
	build: {
		transpile: ["primevue"],
	},
	// vite: {
	// 	ssr: {
	// 		// ensure hammer.js only loads client-side
	// 		noExternal: ["hammerjs"],
	// 	},
	// },
	// server: {
	// 	host: process.env.HOST || "0.0.0.0",
	// 	port: process.env.PORT ? Number(process.env.PORT) : 3000,
	// },
	primevue: {
		// ripple: true, // enable ripple effect
		usePrimeVue: true,
		autoImport: true,
		options: {
			theme: {
				preset: Aura,
				options: {
					// prefix: 'p',
					// darkModeSelector: "system",
					cssLayer: {
						name: "primevue",
						order: "theme, base, primevue",
					},
				},
			},
		},
	},
	runtimeConfig: {
		public: {
			apiBase: process.env.API_BASE_URL || "https://forecaster-tool-backend.onrender.com",
		},
	},
});

console.log("🚀 API_BASE_URL from env:", process.env.API_BASE_URL);
