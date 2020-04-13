const path= require('path');
const HtmlWebackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: ['babel-polyfill','./src/js/index.js'],
    output: {
        path: path.resolve(__dirname,'dist'),
        filename:'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /nodemodules/,
                use:{
                    loader: 'babel-loader'
                }
            }
        ]
    }
};