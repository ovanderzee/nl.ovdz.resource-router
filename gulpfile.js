var gulp = require('gulp');
var webroot = 'htdocs';
var webroot = 'themes/custom';
var compile = webroot + '/static';
var extension = 'extension';
var paths = {
    webroot: [webroot + '/**/*.*'],
    jsobjects: [webroot + '/**/*.json', extension + '/**/*.json'],
    scripts: [webroot + '/**/*.js', extension + '/**/*.js'],
    styles: [webroot + '/**/*.css', extension + '/**/*.css'],
    sass: [compile + '/sass/**/*.s+(a|c)ss'],
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

var connectReload = function(connect) {
    var connect = require('gulp-connect');
    return gulp.src(paths.webroot)
        .pipe(connect.reload());
};

gulp.task('connect', function() {
    var connect = require('gulp-connect');
	connect.server({
		port: 9080,
		root: webroot,
	    livereload: true
	});
    gulp.watch(paths.webroot, connectReload);
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
    gulp.watch(paths.webroot, connectReload);
});

var compileStyles = function (event, fail) {
    var compass = require('gulp-compass');
    // Please make sure to add css and sass options with the same value in config.rb since compass can't output css result directly.
    return gulp.src(event.path)
        .pipe(compass({
            assets: true,
            comment: true,
            css: compile + '/css',
            sass: compile + '/sass',
            sourcemap: true,
            style: 'compact'
        }))
        .on('error', function(error) {
            if (fail) {
                console.log('\n\n' + error);
                console.log('\n\n     Press Ctrl-C to continue');
                this.emit('end');
            }
        })
};

var compileAll = function (fail) {
    compileStyles({path: paths.sass}, fail);
};

gulp.task('compile', function() {
    compileAll(false);
    gulp.watch(paths.sass, compileStyles);
});

gulp.task('develop', [
	'lint',
	'compile',
	'connect',
	'secure'
]);
