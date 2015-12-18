var GithubApi = require('github');
var gulp = require('gulp');


var cp = require('child_process');
var fs = require('fs');

var concat = require('gulp-concat');
var jscs = require('gulp-jscs');

var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var template = require('gulp-template');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

gulp.task('default', function () {
    // place code for your default task here

});

gulp.task('release', function () {
    return gulp.src([
        './src/mistral.js',
        './src/firstInit.js',
        './src/config/*.js',
        './src/route/*.js',
        './src/template/*.js',
        './src/utils/*.js',
    './src/lastInit.js'])
        .pipe(concat('mistral.js'))
        .pipe(gulp.dest('./release'));
})
