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

var lintJSObjects = function(event) {
    return gulp.src(event.path)
        .pipe(jsonlint())
        .pipe(jsonlint.reporter());
};

var lintScripts = function(event) {
    return gulp.src(event.path)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jscs())
        .pipe(jscs.reporter());
};

var lintStyles = function(event) {
    return gulp.src(event.path)
        .pipe(csslint())
        .pipe(csslint.reporter());
};

gulp.task('lint', function() {
    for (var i = 0; i < paths.scripts.length; i++) {
        lintJSObjects({path: paths.jsobjects[i]}).pipe(jsonlint.failOnError());
    }
    for (var i = 0; i < paths.scripts.length; i++) {
        lintScripts({path: paths.scripts[i]}).pipe(jshint.reporter('fail'));
    }
    for (var i = 0; i < paths.scripts.length; i++) {
        lintStyles({path: paths.styles[i]}).pipe(csslint.reporter('fail'));
    }
    gulp.watch(paths.jsobjects, lintJSObjects);
    gulp.watch(paths.scripts, lintScripts);
    gulp.watch(paths.styles, lintStyles);
});

