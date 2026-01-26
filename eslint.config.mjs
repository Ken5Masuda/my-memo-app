import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // useEffectでのsetState呼び出しを許可（フォーム初期化で必要）
      "react-hooks/set-state-in-effect": "off",
      // 未使用変数は警告のみ（エラーにしない）
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
]);

export default eslintConfig;
