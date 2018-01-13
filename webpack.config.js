const path = require('path');

module.exports = {
	entry: './src/index.ts',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build'),
	},
    resolve: {extensions: ['.js', '.jsx', '.ts', '.tsx']},
	module: {
		rules: [
			{
                test: /\.(ts|tsx)$/,
				loader: 'ts-loader'
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader?importLoaders=1',
			},
		],
	}
};
