const path = require('path')
const fs = require('fs-extra')
const webpack = require('webpack')
const fstream = require('fstream')
const unzip = require('unzip')

const config = require('./webpack.config.start')

const [node, filename, ...args] = process.argv
const projectRoot = fs.realpathSync(process.cwd())
const resolve = relativePath => path.resolve(projectRoot, relativePath)

// copy ./static to ./public
fs.copySync(resolve('static'), resolve('public'))

// copy sketch file into public directory and unzip
prepareTarget()

// run webpack
const compiler = webpack(config)
compiler.run((err, stats) => {
	if (err) {
		return reject(err)
	}
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