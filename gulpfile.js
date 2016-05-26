var gulp = require('gulp');
var csslint = require('gulp-csslint');
var jscs = require('gulp-jscs');
var eslint = require('gulp-eslint');
var jsonlint = require("gulp-jsonlint");
var connect = require('gulp-connect');
var fs = require('fs');

var webroot = 'htdocs'
var extension = 'extension';
var paths = {
    jsobjects: [webroot + '/**/*.json', extension + '/**/*.json'],
    scripts: [webroot + '/**/*.js', extension + '/**/*.js'],
    styles: [webroot + '/**/*.css', extension + '/**/*.css'],
};

var lintJSObjects = function(event) {
	console.log('---- lint jsons of ' + event.path + ' ----');
    return gulp.src(event.path)
        .pipe(jsonlint())
        .pipe(jsonlint.reporter());
};

var lintScripts = function(event) {
	console.log('---- lint scripts of ' + event.path + ' ----');
    return gulp.src(event.path)
        .pipe(eslint())
        .pipe(eslint.format('compact'))
        .pipe(jscs())
        .pipe(jscs.reporter());
};

var lintStyles = function(event) {
	console.log('---- lint styles of ' + event.path + ' ----');
    return gulp.src(event.path)
        .pipe(csslint())
        .pipe(csslint.reporter());
};

gulp.task('lint', function() {
    for (var i = 0; i < paths.scripts.length; i++) {
        lintJSObjects({path: paths.jsobjects[i]}).pipe(jsonlint.failOnError());
    }
    for (var i = 0; i < paths.scripts.length; i++) {
        lintScripts({path: paths.scripts[i]}).pipe(eslint.failOnError());
    }
    for (var i = 0; i < paths.scripts.length; i++) {
        lintStyles({path: paths.styles[i]}).pipe(csslint.reporter('fail'));
    }
    gulp.watch(paths.jsobjects, lintJSObjects);
    gulp.watch(paths.scripts, lintScripts);
    gulp.watch(paths.styles, lintStyles);
});

gulp.task('connect', function() {
	connect.server({
		port: 9080,
		root: webroot
	});
});

gulp.task('connectSecure', function() {
	connect.server({
		// https://github.com/gruntjs/grunt-contrib-connect#user-content-support-for-https--http2
		port: 9443,
		root: webroot,
		https: true,
		key: fs.readFileSync('server.key').toString(),
		cert: fs.readFileSync('server.crt').toString(),
		ca: fs.readFileSync('ca.crt').toString()
	});
});

gulp.task('default', [
	'connect',
	'lint'
]);