var gulp = require('gulp');
var projectData = require('./gulp-local-projects.json');
var settingsFactory = require('./gulp-settings-factory.js');
var settings = settingsFactory.new({
	loose: 9080,
	secure: 9443,
	webroot: 'htdocs'
}, projectData);

/*
var webroot = 'htdocs';
//var webroot = 'themes/custom';
*/
var compile = settings.webroot + '/static';
var extension = 'extension';
var paths = {
    webroot: [settings.webroot + '/**/*.*'],
    jsobjects: [settings.webroot + '/**/*.json', extension + '/**/*.json'],
    scripts: [settings.webroot + '/**/*.js', extension + '/**/*.js'],
    styles: [settings.webroot + '/**/*.css', extension + '/**/*.css'],
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
    return gulp.src(settings.webroot)
        .pipe(connect.reload());
};

gulp.task('connect', function() {
    var connect = require('gulp-connect');
	connect.server({
		port: settings.loose,
		root: settings.webroot,
	    livereload: true
	});
    gulp.watch(settings.webroot, connectReload);
});

gulp.task('secure', function() {
    var connect = require('gulp-connect');
    var fs = require('fs');
	connect.server({
		// https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
		// http://stackoverflow.com/questions/12871565/how-to-create-pem-files-for-https-web-server
		port: settings.secure,
		root: settings.webroot,
		https: true,
		key: fs.readFileSync('key.pem'),
		cert: fs.readFileSync('cert.pem')
	});
    gulp.watch(settings.webroot, connectReload);
});

var compileStyles = function (event, fail) {
    var compass = require('gulp-compass');
    // config.rb in compile dir (parent of sass) then comments about line-numbers in sass artifacts
    return gulp.src(event.path)
        .pipe(compass({
            config_file: compile + '/config.rb',
            css: compile + '/css',
            sass: compile + '/sass',
        }))
        .on('error', function(error) {
            if (fail) {
                console.log('\n\n' + error + '\n\n     Press Ctrl-C to continue');
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

gulp.task('settings', function() {
	settings = settingsFactory.make();
	console.log('settings: ' + JSON.stringify(settings));
});

gulp.task('serve', [
	'settings',
	'connect',
	'secure'
]);

gulp.task('sources', [
	'settings',
	'lint',
	'connect',
	'secure'
]);

gulp.task('sass', [
	'settings',
	'lint',
	'compile',
	'connect',
	'secure'
]);


