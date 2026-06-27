import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    ignores: [
      "template/**",
      "docs/**",
      ".next/**",
      "out/**",
      "build/**",
      "public/**",
      "script.js",
      "src/lib/axios/axiosClient.ts",
      "src/lib/logger/logger.ts",
      "src/modules/movie/hooks/useMovies.ts",
      "src/modules/showtime/mappers/showtime.mapper.ts",
      "src/shared/ui/Skeleton.tsx"
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
