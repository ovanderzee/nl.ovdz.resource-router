'use strict';

/* All we want to do is serve the www folder */

module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);
	var servedDir = 'htdocs';
	var extensionDir = 'extension';

	grunt.initConfig({
		// connection is alive as long as watch is running
		connect: {
			server: {
				options: {
					port: 9000,
					base: servedDir
				}
			}
		},

		watch: {
			json: {
				files: ['package.json', servedDir + '/**/*.json', extensionDir + '/**/*.json'],
				tasks: ['newer:jsonlint:src'],
			},
			scripts: {
				files: ['Gruntfile.js', servedDir + '/**/*.js', extensionDir + '/**/*.js'],
				tasks: ['newer:jshint:all'],
			},
			styles: {
				files: [servedDir + '/**/*.css', extensionDir + '/**/*.css'],
				tasks: ['newer:csslint:strict'],
			},
		},

		// Validate stylesheets
		'csslint': {
			strict: {
				options: {
					"important": true,
					"adjoining-classes": false, // don't support ie < 7
					"box-sizing": false, // don't support ie < 8
					"order-alphabetical": false, // can't see the point
					"overqualified-elements": true,
					"bulletproof-font-face": false, // don't support ie < 9
					"compatible-vendor-prefixes": true,
					"duplicate-background-images": false, // can't see the point
					"duplicate-properties": false, // can't see the point
					"fallback-colors": false, // don't support ie < 9
					"star-property-hack": false, // don't support ie < 8
					"underscore-property-hack": false, // don't support ie < 7
					"qualified-headings": false, // can't see the point
					"unique-headings": false, // can't see the point
					"universal-selector": false, // can't see the point
					"zero-units": false, // not sure it works that way; ie10, svg props
					//JIP included
					"box-model": false,
					"ids": false,
				},
				src: [
					servedDir + '/**/*.css',
					extensionDir + '/**/*.css'
				]
			}
		},

		// Make sure there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
			},
			all: [
				'Gruntfile.js',
				servedDir + '/**/*.js',
				extensionDir + '/**/*.js'
			]
		},

		// Check integrity of JSON files
		jsonlint: {
			src: [
				'package.json',
				servedDir + '/**/*.json',
				extensionDir + '/**/*.json'
			]
		}

	});

	grunt.registerTask('serve', 'Compile then start a connect web server', function () {

		grunt.task.run([
			'csslint:strict',
			'jshint:all',
			'jsonlint',
			'connect',
			'watch'
		]);

	});

// 	grunt.event.on('watch', function(action, filepath, target) {
// 		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
// 	});

};
