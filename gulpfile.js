var gulp = require('gulp');
var csslint = require('gulp-csslint');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var jsonlint = require("gulp-jsonlint");

var webroot = 'htdocs'
var extension = 'extension';
var paths = {
    jsobjects: [webroot + '/**/*.json', extension + '/**/*.json'],
    scripts: [webroot + '/**/*.js', extension + '/**/*.js'],
    styles: [webroot + '/**/*.css', extension + '/**/*.css'],
};

var lintJSObjects = function(event, failOnError) {
    var result = gulp.src(event.path)
        .pipe(jsonlint())
        .pipe(jsonlint.reporter());
    if (failOnError) {
        result.pipe(jsonlint.failOnError());
    }
    return result;
};

var lintScripts = function(event, failOnError) {
    var result = gulp.src(event.path)
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(jscs())
        .pipe(jscs.reporter());
    if (failOnError) {
        result.pipe(jshint.reporter('fail'))
    }
    return result;
};

var lintStyles = function(event, failOnError) {
    var result = gulp.src(event.path)
        .pipe(csslint())
        .pipe(csslint.reporter());
    if (failOnError) {
        result.pipe(csslint.reporter('fail'));
    }
    return result;
};

gulp.task('lint', function() {
    for (var i = 0; i < paths.scripts.length; i++) {
        lintJSObjects({path: paths.jsobjects[i]}, true);
    }
    for (var i = 0; i < paths.scripts.length; i++) {
        lintScripts({path: paths.scripts[i]}, true);
    }
    for (var i = 0; i < paths.scripts.length; i++) {
        lintStyles({path: paths.styles[i]}, true);
    }
    gulp.watch(paths.jsobjects, lintJSObjects);
    gulp.watch(paths.scripts, lintScripts);
    gulp.watch(paths.styles, lintStyles);
});

