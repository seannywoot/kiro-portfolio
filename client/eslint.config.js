import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Configure react/no-unknown-property to allow Three.js properties
      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            // Three.js/React Three Fiber properties
            'args',
            'attach',
            'castShadow',
            'receiveShadow',
            'geometry',
            'material',
            'position',
            'rotation',
            'scale',
            'visible',
            'userData',
            'renderOrder',
            'frustumCulled',
            'matrixAutoUpdate',
            'layers',
            'up',
            'shadow',
            'intensity',
            'color',
            'distance',
            'angle',
            'penumbra',
            'decay',
            'target',
            'map',
            'map-anisotropy',
            'material-roughness',
            'clearcoat',
            'clearcoatRoughness',
            'roughness',
            'metalness',
            'depthTest',
            'useMap',
            'repeat',
            'lineWidth',
            'resolution',
            // Rapier physics properties
            'type',
            'canSleep',
            'colliders',
            'angularDamping',
            'linearDamping',
          ],
        },
      ],
      // Disable React in scope rule since we're using React 17+ JSX transform
      'react/react-in-jsx-scope': 'off',
      // Allow JSX in .tsx files
      'react/jsx-filename-extension': [
        'warn',
        { extensions: ['.tsx'] },
      ],
    },
  },
)
