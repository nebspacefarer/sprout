import { defineConfig, presetWind4, transformerDirectives } from "unocss";
import { presetLightDark } from "unocss-preset-light-dark";

export default defineConfig({
	content: {
		filesystem: ["./src/**/*.{html,js,ts,jsx,tsx}"],
	},
	presets: [
		presetWind4({
			preflights: {},
		}),
		presetLightDark({
			colors: {
				base: ["#FFFFFF", "#272736"],
				surface: "#1D1D29",
				crust: "#191923",

				primary: { DEFAULT: "#ac80ff", foreground: "#222222" },
				// primaryForeground: "#222222",
				secondary: "#b398ff",
				secondaryForeground: "#222222",
				accent: "#ffa31a",
				accentForeground: "#222222",

				foreground: "#dfdfdf",
				danger: "#F76363",
				success: "#A8FF78",

				muted: "#5a5961",
				border: "#2c2b34",
				input: "#28343e",
			},
		}),
	],
	rules: [
		["p-xs", { padding: "calc(var(--spacing) * 3) !important" }],
		["p-sm", { padding: "calc(var(--spacing) * 6) !important" }],
		["gap-xs", { gap: "calc(var(--spacing) * 3) !important" }],
		["gap-sm", { gap: "calc(var(--spacing) * 6) !important" }],
	],

	transformers: [transformerDirectives()],
});
