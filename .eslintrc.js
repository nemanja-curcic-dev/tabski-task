module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    rules: {
        '@typescript-eslint/semi': ['error'],
        quotes: ['error', 'single'],
        indent: [
            'error',
            4,
            { SwitchCase: 1, ignoredNodes: ['PropertyDefinition'] },
        ],
        '@typescript-eslint/no-empty-interface': [
            'warn',
            {
                allowSingleExtends: false,
            },
        ],
        '@typescript-eslint/explicit-function-return-type': 'warn',
        'comma-spacing': ['error', { 'before': false, 'after': true }]
    },
};
