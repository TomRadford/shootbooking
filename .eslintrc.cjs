/** @type {import("eslint").Linter.Config} */
module.exports = {
	overrides: [
		{
			extends: [
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:prettier/recommended',
			],
			files: ['*.ts', '*.tsx'],
			parserOptions: {
				project: 'tsconfig.json',
			},
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
	},
	plugins: ['@typescript-eslint'],
	extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
	rules: {
		'@typescript-eslint/consistent-type-imports': [
			'warn',
			{
				prefer: 'type-imports',
				fixStyle: 'inline-type-imports',
			},
		],
		'prettier/prettier': [
			'error',
			{
				useTabs: true,
				tabWidth: 2,
				printWidth: 80,
				singleQuote: true,
				semi: false,
				endOfLine: 'auto',
			},
		],
		'@typescript-eslint/no-misused-promises': [
			2,
			{
				checksVoidReturn: {
					attributes: false,
				},
			},
		],
	},
}
