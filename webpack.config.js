const path = require('path');
const childProcess = require('child_process');
const packageVersion = require('./package.json').version;
let mode = 'development';

const commithash = childProcess.execSync('git rev-parse HEAD').toString().substring(0,7);

module.exports = [{
    mode: mode,
    devServer: {
        historyApiFallback: true,
    },
    context: path.join(__dirname),
    entry: {
        'index': [
            './src/index.js',
        ]
    },
    output: {
        path: path.join(__dirname, 'dist', packageVersion),
        publicPath: '/',
        filename: `[name]-${commithash}.js`
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }, {
                test: /\.(graphql|gql)$/,
                exclude: /(node_modules|bower_compontents)/,
                use: {
                    loader: 'graphql-tag/loader',
                }
            }
        ]
    },
}];
