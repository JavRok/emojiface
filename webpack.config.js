const path = require('path');

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: "emojibody.js"
    },
    mode: "production",
    resolve: {
        // Add '.ts' as a resolvable extension.
        extensions: [".webpack.js", ".ts", ".js"]
    },
    module: {
        rules: [
            // all files with a '.ts' extension will be handled by 'ts-loader'
            { test: /\.ts$/, loader: "ts-loader" }
        ]
    }
}
