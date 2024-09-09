const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Word Finder Game',
            template: 'src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'bundle.css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: `src/favicons`, to: 'favicons' }
            ]
        })
    ],
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 4000,
    }
};
