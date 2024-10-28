import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from '@rsbuild/plugin-sass'

export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  environments: {
    web: {
      output: {
        target: "web",
      },
      source: {
        entry: {
          index: "./src/index",
        },
      },
    },
    ssr: {
      output: {
        target: "node",
        distPath: {
          root: "dist/server",
        },
      },
      source: {
        entry: {
          index: "./src/index.server",
        },
      },
    },
  },
  html: {
    template: "./index.html",
  },
});
