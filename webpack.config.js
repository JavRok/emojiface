const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: {
        main: './src/js/index.ts',
    },
    mode: 'development',
    output: {
        path: path.join(__dirname, 'public', 'js'),
        filename: 'emojibody.js',
    },
    resolve: {
        // Add '.ts' as a resolvable extension.
        extensions: ['.webpack.js', '.ts', '.js'],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '../css/[name].css',
        }),
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './public/',
        publicPath: '/js/',
        hot: true,
        open: true,
        port: 3001,
        host: '0.0.0.0',  // Allows access from other devices
    },
    // optimization: {
    //     minimizer: [
    //         new UglifyJsPlugin({
    //             cache: true,
    //             parallel: true,
    //             sourceMap: true, // set to true if you want JS source maps
    //         }),
    //         new OptimizeCSSAssetsPlugin({}),
    //     ],
    //     splitChunks: {
    //         cacheGroups: {
    //             styles: {
    //                 name: 'main',
    //                 test: /\.css$/,
    //                 chunks: 'all',
    //                 enforce: true,
    //             },
    //         },
    //     },
    // },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' },
            {
                test: /\.css$/,
                loaders: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: './public/css',
                        },
                    },
                    'css-loader',
                ],
            },
        ],
    },
};
