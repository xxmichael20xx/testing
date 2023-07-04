const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");


const entryObj = glob.sync('./scss/entry/**.scss').reduce((acc, file) => {
    const name = path.basename(file, '.scss');
    acc[`${name}.autostyle`] = path.resolve(__dirname, `scss/entry/${name}.scss`);
    return acc;
}, glob.sync('./js/entry/**.js').reduce((acc, file) => {
    const name = path.basename(file, '.js');
    acc[`${name}.autojs`] = path.resolve(__dirname, `js/entry/${name}.js`);
    return acc;
}, {}));

console.log(`Entry Objects`, entryObj);

module.exports = {
    mode: 'production',
    entry: entryObj,
    plugins: [
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
    module: {
        rules: [{
                test: /\.s[ac]ss$/i,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: { presets: ["@babel/env"] }
            },
            {
                test: /\.(ttf|woff|woff2)$/,
                type: 'asset/resource',
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        publicPath: ''
    }
};