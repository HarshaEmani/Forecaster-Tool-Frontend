import Aura from "@primeuix/themes/aura";
import Material from "@primeuix/themes/material";
import Lara from "@primeuix/themes/lara";

export default defineNuxtConfig({
	modules: ["@primevue/nuxt-module", "@pinia/nuxt", "@vueuse/nuxt"],
	css: ["primeflex/primeflex.css", "primeicons/primeicons.css", "@/assets/tailwind.css"],
	plugins: [
		// load your custom theme preset
		"~/plugins/my-custom-theme.ts",
	],
	build: {
		transpile: ["primevue"],
	},
	vite: {
		ssr: {
			// ensure hammer.js only loads client-side
			noExternal: ["hammerjs"],
		},
	},
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
			apiBase: "http://localhost:8000",
		},
	},
});
