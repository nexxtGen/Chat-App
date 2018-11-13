const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');


//webpack.config.js
const plugins = [new HtmlWebpackPlugin({
    template: 'client/index.html',
    filename: 'index.html',
    inject: 'body'
})];

module.exports = (env) => {
    if (env === 'production') {
        plugins.push(
            new OptimizeJsPlugin({
                sourceMap: false
            })
        )
    }

    return {
        mode: env || 'production',
        entry: './client/index.js',    
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: 'app.bundle.js'
        },
        module: { //module. Jego zadanie polega na wpływaniu na moduły, które bezpośrednio ładujemy jako zależności naszej aplikacji. Przeważnie jedynym parametrem, który będzie wpływał na moduły, będzie parametr rules. 
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    options: {
                        plugins: env !== 'production' ? ["react-hot-loader/babel"] : []
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: 'style-loader'},
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true
                            }
                        }
                    ]
                }
            ]
        },

        devServer: {
            proxy: {
                '/socket.io': {
                    target: 'http://localhost:3001',
                    ws: true
                }
            }
        },
        
        plugins: plugins        
    }
};