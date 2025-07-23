import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const config = [
  // Main build configuration
  {
    input: "src/index.tsx",
    output: [
      {
        file: "dist/index.cjs.js",
        format: "cjs",
        sourcemap: true,
        exports: "named",
        inlineDynamicImports: true,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      // PeerDepsExternal plugin to externalize peer dependencies only
      peerDepsExternal({
        packageJsonPath: "./package.json",
      }),
      // Resolve plugin to handle module resolution including node_modules
      resolve({
        browser: true,
        preferBuiltins: false,
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      }),
      // CommonJS plugin to handle CommonJS modules
      commonjs(),
      // Babel plugin to transform TypeScript and JSX
      babel({
        babelHelpers: "bundled",
        exclude: /node_modules\/(?!zpl-js)/, // Exclude node_modules except zpl-js
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
              targets: {
                browsers: ["defaults"],
              },
            },
          ],
          [
            "@babel/preset-react",
            {
              runtime: "automatic",
            },
          ],
          "@babel/preset-typescript",
        ],
      }),
    ],
    // Only treat React as external, bundle everything else including zpl-js
    external: ["react", "react-dom"],
  },
  // Type declarations build configuration
  {
    input: "src/index.tsx",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
    external: ["react", "react-dom"],
  },
];

export default config;
