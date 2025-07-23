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
        exports: "default",
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
      // Use peerDepsExternal to automatically externalize peer dependencies
      peerDepsExternal(),
      // Resolve plugin with minimal resolution
      resolve({
        browser: true,
        preferBuiltins: false,
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
      // CommonJS plugin
      commonjs(),
      // Babel plugin to transform TypeScript and JSX
      babel({
        babelHelpers: "bundled",
        exclude: /node_modules\/(?!zpl-js)/,
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
              targets: {
                node: "14",
                browsers: ["> 0.25%", "not dead"],
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
    // Additional explicit externalization as fallback
    external: (id) => {
      if (
        id === "react" ||
        id === "react-dom" ||
        id === "react/jsx-runtime" ||
        id === "react/jsx-dev-runtime" ||
        id.startsWith("react/") ||
        id.startsWith("react-dom/")
      ) {
        return true;
      }
      return false;
    },
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
