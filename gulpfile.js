var gulp = require('gulp');
var csslint = require('gulp-csslint');
var jscs = require('gulp-jscs');
var eslint = require('gulp-eslint');
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
        .pipe(eslint())
        .pipe(eslint.format('compact'))
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
        lintScripts({path: paths.scripts[i]}).pipe(eslint.failOnError());
    }
    for (var i = 0; i < paths.scripts.length; i++) {
        lintStyles({path: paths.styles[i]}).pipe(csslint.reporter('fail'));
    }
    gulp.watch(paths.jsobjects, lintJSObjects);
    gulp.watch(paths.scripts, lintScripts);
    gulp.watch(paths.styles, lintStyles);
});

