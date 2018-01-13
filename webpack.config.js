const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {emitErrors: true, failOnHint: true}
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?importLoaders=1',
            },
        ],
    }
};
