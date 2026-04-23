module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  ignorePatterns: ["dist", "node_modules"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "react-refresh"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "no-unused-vars": "off",
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-refresh/only-export-components": "off",
  },
};
