import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';

const config = [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'default',
        inlineDynamicImports: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      // Resolve plugin - let it resolve everything except React
      resolve({
        browser: true,
        preferBuiltins: false,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      // CommonJS plugin
      commonjs(),
      // Babel plugin to transform TypeScript and JSX
      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules\/(?!zpl-js)/,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              targets: {
                node: '14',
                browsers: ['> 0.25%', 'not dead'],
              },
            },
          ],
          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
            },
          ],
          '@babel/preset-typescript',
        ],
      }),
    ],
    // Comprehensive externalization to ensure React is never bundled
    external: (id, parent, isResolved) => {
      // Always externalize React and related modules
      const reactModules = [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom/client',
        'react-dom/server',
        'react/index',
      ];

      // Check exact matches and prefixes
      if (
        reactModules.includes(id) ||
        id.startsWith('react/') ||
        id.startsWith('react-dom/')
      ) {
        return true;
      }

      return false;
    },
  },
  // Type declarations build configuration
  {
    input: 'src/index.tsx',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
    external: ['react', 'react-dom'],
  },
];

export default config;
