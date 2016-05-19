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
        .pipe(jscs())
        .pipe(jscs.reporter());
};

var lintScripts = function(event) {
    return gulp.src(event.path)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))
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
        lintJSObjects({path: paths.jsobjects[i]});
    }
    for (var i = 0; i < paths.scripts.length; i++) {
        lintScripts({path: paths.scripts[i]});
    }
    for (var i = 0; i < paths.scripts.length; i++) {
        lintStyles({path: paths.styles[i]});
    }
    gulp.watch(paths.jsobjects, lintJSObjects);
    gulp.watch(paths.scripts, lintScripts);
    gulp.watch(paths.styles, lintStyles);
});

