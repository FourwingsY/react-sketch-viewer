const path = require('path')
const fs = require('fs-extra')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const fstream = require('fstream')
const unzip = require('unzip')

const config = require('./webpack.config.start')
const devServerConfig = require('./webpackDevServer.config')

const [node, filename, ...args] = process.argv
const projectRoot = fs.realpathSync(process.cwd())
const resolve = relativePath => path.resolve(projectRoot, relativePath)

// copy ./static to ./public
fs.copySync(resolve('static'), resolve('public'))

// copy sketch file into public directory and unzip
prepareTarget()

// do webpack things
const compiler = webpack(config)
const devServer = new WebpackDevServer(compiler, devServerConfig)

const PORT = 8000
const HOST = '0.0.0.0'

// Launch WebpackDevServer.
devServer.listen(PORT, HOST, err => {
	if (err) {
		return console.log(err)
	}
	console.log('\nStarting the development server...')
	console.log(`on ${HOST}:${PORT}\n`)
})


function prepareTarget() {
	// initial code assumes args[0] is relative path
	const sketchFile = resolve(args[0])
	const outputPath = resolve('public/target')
	const targetZipFile = path.resolve(outputPath, 'target.zip')

	// copy .sketch file to target.zip
	fs.emptyDirSync(outputPath)
	fs.copySync(sketchFile, targetZipFile)

	// unzip target.zip
	const readStream = fs.createReadStream(targetZipFile)
	const writeStream = fstream.Writer(outputPath)
	readStream
		.pipe(unzip.Parse())
		.pipe(writeStream)

	// remove target.zip
	fs.removeSync(targetZipFile)
}