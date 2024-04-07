module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",

    "plugin:import/recommended",
    "plugin:tailwindcss/recommended",
    "plugin:import/typescript",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "api/*"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-refresh"],
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
  rules: {
    "import/no-internal-modules": [
      "error",
      {
        allow: [
          "react-dom/client",
          "~/*",
          "~/src/*",
          "~/components/utils",
          "~/components/ui/*",
          "~/components/*",
          "~/trpc/client",
        ],
      },
    ],
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
