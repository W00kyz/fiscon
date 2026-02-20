import js from "@eslint/js"
import tseslint from "typescript-eslint"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import importPlugin from "eslint-plugin-import"
import functional from "eslint-plugin-functional"
import prettier from "eslint-config-prettier"

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["node_modules/*", "dist/*", "build/*"],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
      functional,
    },
    rules: {
      // React
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Import organização
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal"],
          alphabetize: { order: "asc" },
        },
      ],

      // 🔥 Paradigma funcional
      "functional/no-let": "error",
      "functional/no-loop-statements": "error",
      "functional/no-conditional-statements": "off",
      "functional/immutable-data": "error",
      "functional/prefer-readonly-type": "warn",

      // Evitar mutação
      "no-param-reassign": "error",

      // Boas práticas TS
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["src/components/ui/**/*.tsx"],
    rules: {
      "functional/immutable-data": "off",
      "functional/prefer-readonly-type": "off",
      "functional/no-let": "off",
    },
  },
  {
    files: ["src/api/mock-data/store.ts"],
    rules: {
      "functional/no-let": "off",
      "functional/immutable-data": "off",
    },
  },
  {
    files: ["src/lib/excel-export.ts"],
    rules: {
      "functional/immutable-data": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "functional/immutable-data": "off",
      "functional/no-let": "off",
    },
  },
]