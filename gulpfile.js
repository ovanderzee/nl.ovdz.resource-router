var gulp = require('gulp');
var projectData = require('./gulp-local-projects.json');
var settingsFactory = require('./gulp-settings-factory.js');
var settings = settingsFactory.new({
	loose: 9080,
	secure: 9443,
	docroot: 'htdocs'
}, projectData);

var compile = settings.docroot + '/static';
var extension = 'extension';
var paths = {
    docroot: [settings.docroot + '/**/*.*'],
    jsobjects: [settings.docroot + '/**/*.json', extension + '/**/*.json'],
    scripts: [settings.docroot + '/**/*.js', extension + '/**/*.js'],
    styles: [settings.docroot + '/**/*.css', extension + '/**/*.css'],
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
    return gulp.src(settings.docroot)
        .pipe(connect.reload());
};

var cors = function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'headers_you_want_to_accept');
	next();
};

gulp.task('connect', function() {
    var connect = require('gulp-connect');
	connect.server({
		port: settings.loose,
		root: settings.docroot,
		middleware: function() {
			return [cors];
		},
	    livereload: true
	});
    gulp.watch(settings.docroot, connectReload);
});

gulp.task('secure', function() {
    var connect = require('gulp-connect');
    var fs = require('fs');
	connect.server({
		// https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
		// http://stackoverflow.com/questions/12871565/how-to-create-pem-files-for-https-web-server
		port: settings.secure,
		root: settings.docroot,
		middleware: function() {
			return [cors];
		},
		https: true,
		key: fs.readFileSync('key.pem'),
		cert: fs.readFileSync('cert.pem')
	});
    gulp.watch(settings.docroot, connectReload);
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
	if (settings.docroot && settings.command && settings.command.exec) {
		var commandService = require('./gulp-command-service.js');
		commandService.run(settings);
	}
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


