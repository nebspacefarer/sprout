import { defineConfig } from "@rsbuild/core";
import { pluginImageCompress } from "@rsbuild/plugin-image-compress";
import { pluginPreact } from "@rsbuild/plugin-preact";
import UnoCSS from "@unocss/postcss";

// Docs: https://rsbuild.rs/config/
export default defineConfig({
	plugins: [
		pluginPreact({ prefreshEnabled: false }),
		pluginImageCompress(["jpeg", "png", "ico", "svg"]),
	],
	html: {
		title: "Sprout - Project Management",
	},
	source: {
		entry: {
			index: "./src/index.tsx",
		},
	},
	server: {
		port: 3535,
		strictPort: true,
	},
	tools: {
		postcss: {
			postcssOptions: {
				plugins: [UnoCSS()],
			},
		},
	},
	dev: {
		client: {
			protocol: "ws",
			host: "localhost",
			port: "3535",
		},
		watchFiles: {
			paths: ["./src/**", "./public/**"],
		},
		hmr: true,
		liveReload: true,
	},
	resolve: {
		aliasStrategy: "prefer-tsconfig",
		alias: {
			"#primitives": "./src/components/primitives",
			"#utils": "./src/utils",
			"#pages": "./src/components/pages",
		},
	},
});
