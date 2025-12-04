import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';

export default [
  {
    files: ['src/**/*.ts', 'test/**/*.spec.ts', 'test/**/*.test.ts'],
    ignores: ['.gitea', 'build'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // Add browser and ES2022 globals manually if needed
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
      jest: jestPlugin, // Added jest plugin,
    },
    rules: {
      // Airbnb base rules
      'array-bracket-spacing': ['error', 'never'],
      'block-spacing': ['error', 'always'],
      'brace-style': 'off',
      'comma-spacing': ['error', { before: false, after: true }],
      'comma-style': ['error', 'last'],
      'computed-property-spacing': ['error', 'never'],
      'consistent-return': 'error',
      curly: ['error', 'multi-line'],
      'dot-location': ['error', 'property'],
      'eol-last': ['error', 'always'],
      'func-names': 'warn',
      'jsx-quotes': ['error', 'prefer-double'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: false },
      ],
      'max-len': [
        'error',
        140,
        2,
        {
          ignoreUrls: true,
          ignoreComments: false,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'new-cap': ['error', { newIsCap: true, capIsNew: false }],
      'no-array-constructor': 'error',
      'no-bitwise': 'error',
      'no-console': 'warn',
      'no-continue': 'error',
      'no-lonely-if': 'error',
      'no-mixed-operators': [
        'error',
        {
          groups: [
            ['&&', '||'],
            ['==', '!=', '===', '!=='],
            ['in', 'instanceof'],
          ],
        },
      ],
      'no-multi-assign': ['error'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'no-nested-ternary': 'error',
      'no-new-object': 'error',
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-ternary': 'off',
      'no-trailing-spaces': 'error',
      'no-underscore-dangle': [
        'error',
        {
          allowAfterThis: false,
          allowAfterSuper: false,
          enforceInMethodNames: true,
        },
      ],
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'object-curly-newline': ['error', { consistent: true }],
      'object-curly-spacing': ['error', 'always'],
      'one-var': ['error', 'never'],
      'operator-assignment': ['error', 'always'],
      // 'padded-blocks': [
      //   'error',
      //   { blocks: 'never', switches: 'never', classes: 'always' },
      // ],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: false, object: true },
        },
        { enforceForRenamedProperties: false },
      ],
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      semi: ['error', 'always'],
      'semi-spacing': ['error', { before: false, after: true }],
      'space-before-blocks': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'spaced-comment': [
        'error',
        'always',
        {
          line: { markers: ['*package', '!', '/', ',', '='] },
          block: {
            balanced: true,
            markers: ['*package', '!', ',', ':', '::', 'flow-include'],
            exceptions: ['*'],
          },
        },
      ],
      // Airbnb TypeScript rules
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/dot-notation': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/return-await': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/consistent-type-imports': 'error', // Ensures consistent use of type imports
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_', // Ignore catch clause variables starting with an underscore
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'always-multiline',
        },
      ],
      // Prettier rules
      // 'prettier/prettier': ['error', { endOfLine: 'auto', bracketSpacing: true }],
      // Additional rules
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
          filter: {
            regex: '^(_|REGISTER_)',
            match: false,
          },
        },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['UPPER_CASE', 'camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'enumMember',
          format: ['PascalCase', 'UPPER_CASE'],
        },
      ],

      'import/extensions': 0,
      'no-await-in-loop': 0,
      'import/prefer-default-export': 'warn',
      'import/no-cycle': ['warn', { maxDepth: 5 }],
      'import/named': 'error',
      'import/no-duplicates': 'error', // Ensures that duplicate imports are flagged
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external', 'internal']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    files: ['*.d.ts'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['eslintrc.config.js'],
    languageOptions: {
      parserOptions: {
        sourceType: 'script',
      },
      globals: {
        // Add Node.js globals manually if needed
      },
    },
  },
];
