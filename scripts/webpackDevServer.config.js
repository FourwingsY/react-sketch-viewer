module.exports = {
	compress: true,
	clientLogLevel: 'none',
	contentBase: 'public',
	watchContentBase: true,
	hot: true,
	publicPath: '/',
	quiet: true,
	watchOptions: {
		ignored: /node_modules/,
	},
	host: '0.0.0.0',
	disableHostCheck: true,
}
