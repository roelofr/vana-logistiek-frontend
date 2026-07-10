import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["app/**/*.spec.ts"],
          environment: "node",
        },
      },
      // {
      //   test: {
      //     name: "e2e",
      //     include: ["test/e2e/*.spec.ts"],
      //     environment: "node",
      //   },
      // },
      // await defineVitestProject({
      //   test: {
      //     name: "nuxt",
      //     include: ["test/nuxt/*.spec.ts"],
      //     environment: "nuxt",
      //   },
      // }),
    ],
  },
});
