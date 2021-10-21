const path = require('path');
const webpack = require('webpack');

/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @type WebpackConfig */
const webExtensionConfig = {
    mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
    target: 'webworker', // extensions run in a webworker context
    entry: {
        extension: './src/extension.ts', // source of the web extension main file
    },
    output: {
        filename: '[name]-web.js',
        path: path.join(__dirname, './out/web'),
        libraryTarget: 'commonjs',
        devtoolModuleFilenameTemplate: '../../[resource-path]'
    },
    resolve: {
        mainFields: ['browser', 'module', 'main'], // look for `browser` entry point in imported node modules
        extensions: ['.ts', '.js'], // support ts-files and js-files
        alias: {
            core: path.join(__dirname, 'core'),
        },
        fallback: {
            // Webpack 5 no longer polyfills Node.js core modules automatically.
            // see https://webpack.js.org/configuration/resolve/#resolvefallback
            // for the list of Node.js core module polyfills.
            os: require.resolve('os-browserify/browser'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            tls: require.resolve('tls-browserify'),
            path: require.resolve("path-browserify"),
            crypto: require.resolve("crypto-browserify"),
            zlib: require.resolve("browserify-zlib"),
            url: require.resolve("url/"),
            stream: require.resolve("stream-browserify"),
            constants: require.resolve("constants-browserify"),
            net: false,
            process: require.resolve('process/browser'),
            vm: require.resolve("vm-browserify"),
            buffer: require.resolve('buffer'),
            console: require.resolve('console-browserify'),
            util: require.resolve('util'),
            fs: require.resolve('browserify-fs'),
            dns: false,
            'proxy-agent': false,
            'socks-proxy-agent': false,
            'pac-resolver': false
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        // Work around for Buffer is undefined:
        // https://github.com/webpack/changelog-v5/issues/10
        new webpack.ProvidePlugin({
            Buffer: [require.resolve("buffer/"), "Buffer"],
            process: 'process/browser' // provide a shim for the global `process` variable
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG),
            'process.type': JSON.stringify(process.type),
            'process.versions': JSON.stringify({... process.versions, node: ''}),
        })
    ],
    externals: {
        vscode: 'commonjs vscode' // ignored because it doesn't exist
    },
    performance: {
        hints: false
    },
    devtool: 'nosources-source-map' // create a source map that points to the original source file
};
module.exports = [webExtensionConfig];