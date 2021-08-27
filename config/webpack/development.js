process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')

module.exports = environment.toWebpackConfig()

// https://gorails.com/forum/error-in-chunk-application-entry-js-name-contenthash-js-cannot-use-chunkhash-or-contenthash-for-chunk-in
const config = environment.toWebpackConfig();
config.output.filename = "js/[name]-[hash].js"