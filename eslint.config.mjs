import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
export default defineConfig([
    // Configuración base para archivos TypeScript y módulos
    {
        files: ["**/*.{ts,tsx,mts,cts}"], // 🔹 Ignora .js y .mjs
        ignores: ["**/*.js"], // 🔹 No analizar archivos .js
        languageOptions: {
            globals: Object.assign({}, globals.node),
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            js,
        },
        extends: [
            js.configs.recommended, // 🔹 reglas JS base
            ...tseslint.configs.recommended, // 🔹 reglas TS
        ],
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            // 🔹 Personaliza reglas:
            "no-console": "error", // era error, ahora warning
            "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // cambiar error a warning
            "@typescript-eslint/explicit-module-boundary-types": 'off',
            "@typescript-eslint/no-explicit-any": "warn", // avisar, no romper build
            '@typescript-eslint/no-namespace': 'off',
            "no-unused-labels": "warn",
            "no-undef": "off", // desactiva si te da falsos positivos en TS
            "@typescript-eslint/no-unused-vars-experimental": "off", // 🔹 asegúrate de tener esto
            "@typescript-eslint/no-unused-expressions": "off", // 🔹 evita falsos positivos en tipos TS
        },
    },
    // 🔹 Ignorar directorios completos si querés
    {
        ignores: [
            "node_modules/",
            "dist/",
            "build/",
            "coverage/",
        ],
    },
]);