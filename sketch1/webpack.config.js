var path = require('path');
var webpack = require('webpack');

var minimize = false;
process.argv.forEach(function (opt) {
    if (opt === "-p")
        minimize = true;
});

//-------------------------------------------------------
// defaults
var config = {

    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist'
    },
    module: {
        rules: [

            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
    ]
};

//-------------------------------------------------------
// extra prod options
if (minimize) {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            // ...
        })
    )
}

//-------------------------------------------------------
//export
module.exports = config;