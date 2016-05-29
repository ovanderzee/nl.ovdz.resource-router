var gulp = require('gulp');
var webroot = 'htdocs'
var extension = 'extension';
var paths = {
    jsobjects: [webroot + '/**/*.json', extension + '/**/*.json'],
    scripts: [webroot + '/**/*.js', extension + '/**/*.js'],
    styles: [webroot + '/**/*.css', extension + '/**/*.css'],
};

var lintLog = function(event) {
    console.log('\n---- linted ' + event.path + ' ----');
};

var lintJSObjects = function(event, fail) {
    var jsonlint = require("gulp-jsonlint");
    lintLog(event);
    var result = gulp.src(event.path)
        .pipe(jsonlint())
        .pipe(jsonlint.reporter());
	if (fail) {
	    result.pipe(jsonlint.failOnError());
	}
    return result;
};

var lintScripts = function(event, fail) {
    var eslint = require('gulp-eslint');
    var jscs = require('gulp-jscs');
    lintLog(event);
    var result = gulp.src(event.path)
        .pipe(eslint())
        .pipe(eslint.format('compact'))
        .pipe(jscs())
        .pipe(jscs.reporter());
	if (fail) {
	    result.pipe(eslint.failOnError());
	}
    return result;
};

var lintStyles = function(event, fail) {
    var csslint = require('gulp-csslint');
    lintLog(event);
    var result = gulp.src(event.path)
        .pipe(csslint())
        .pipe(csslint.reporter());
	if (fail) {
	    result.pipe(csslint.failReporter());
        // when csslint encounters a problem,
        // you'll get an "Unhandled 'error' event" in events.js
        // https://github.com/lazd/gulp-csslint/issues/50
	}
    return result;
};

var lintAll = function(fail) {
    for (var i = 0; i < paths.scripts.length; i++) {
        lintJSObjects({path: paths.jsobjects[i]}, fail)
    }
    for (var i = 0; i < paths.scripts.length; i++) {
        lintScripts({path: paths.scripts[i]}, fail)
    }
    for (var i = 0; i < paths.scripts.length; i++) {
        lintStyles({path: paths.styles[i]}, fail)
    }
};

gulp.task('lint', function() {
    lintAll(false);
    gulp.watch(paths.jsobjects, lintJSObjects);
    gulp.watch(paths.scripts, lintScripts);
    gulp.watch(paths.styles, lintStyles);
});

gulp.task('connect', function() {
    var connect = require('gulp-connect');
	connect.server({
		port: 9080,
		root: webroot
	});
});

gulp.task('secure', function() {
    var connect = require('gulp-connect');
    var fs = require('fs');
	connect.server({
		// https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
		// http://stackoverflow.com/questions/12871565/how-to-create-pem-files-for-https-web-server
		port: 9443,
		root: webroot,
		https: true,
		key: fs.readFileSync('key.pem'),
		cert: fs.readFileSync('cert.pem')
	});
});

gulp.task('develop', [
	'connect',
	'secure',
	'lint'
]);