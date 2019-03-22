const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: {
        main: './src/js/index.ts',
        serviceWorker: './src/js/pwa.js',
    },
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        publicPath: '/js/',
        filename: '[name].js',
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
        contentBase: path.join(__dirname, 'public/'),
        publicPath: '/js/',
        inline: true,
        hot: true,
        compress: true,
        open: true,
        port: 3001,
        // host: '0.0.0.0',     // Allows access from other devices
    },
    optimization: {
        minimizer: [
            // For some reason, Uglify is breaking the build
            // new UglifyJsPlugin({
            //     cache: true,
            //     parallel: true,
            //     sourceMap: true,
            // }),
            new OptimizeCSSAssetsPlugin({}),
        ],
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'main',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    publicPath: './public/',
                    limit: 10000,
                },
            },
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
                    // 'style-loader',
                    'css-loader',
                ],
            },
        ],
    },
};
