const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestWebpackPlugin = require('webpack-manifest-plugin');

const VENDOR_LIBS = [
    'react', 'redux', 'react-dom'
];

module.exports = (env) => {
    console.log('env: ', env);

    return {
        entry: {
            bundle: './src/index.js',
            vendor: VENDOR_LIBS
        },
        output: {
            path: path.join(__dirname, 'dist-' + env.environment),
            filename: '[name].[chunkhash].js'
        },
        performance: {
            maxEntrypointSize: 2048 * 1024
        },
        module: {
            rules: [
                {
                    test: /\.(jsx?)$/i,
                    use: {
                        loader: 'babel-loader'
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.(jpe?g|gif|png|svg)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {},
                        },
                    ],
                },
                {
                    test: /\.(ttf|eot|woff|woff2|otf)$/,
                    use: {
                        loader: "file-loader"
                    },
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(scss)$/,
                    use: [{
                        loader: 'style-loader', // inject CSS to page
                    }, {
                        loader: 'css-loader', // translates CSS into CommonJS modules
                    }, {
                        loader: 'postcss-loader', // Run post css actions
                        options: {
                            plugins: function () { // post css plugins, can be exported to postcss.config.js
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ];
                            }
                        }
                    }, {
                        loader: 'sass-loader' // compiles Sass to CSS
                    }]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin({}),
            new HtmlWebpackPlugin({
                template: "./public/index.html",
                favicon: "./public/favicon.ico",
                filename: "./index.html"
            }),
            new webpack.DefinePlugin({
                'process.env.URL_API_VIEWMOD': JSON.stringify(env.URL_API_VIEWMOD),
                'process.env.ENVIRONMENT': JSON.stringify(env.environment)
            }),
            new ManifestWebpackPlugin(),
            new CopyWebpackPlugin([
                { from: 'public/images', to: 'images' }
            ])
        ]
    };
};