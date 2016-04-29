var gulp              = require('gulp');
var beep              = require('beepbeep');
var babel             = require('gulp-babel');
var sourcemaps        = require('gulp-sourcemaps');
var config            = require('../config').examples;
var configJS          = require('../config').examplesJS;

// Copy files directly simple
gulp.task('examples', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});

var errorHandler = function (error) {
  console.log(error.toString());
  beep();
  this.emit('end');
};

// Babel configuration in .babelrc. In addition to ES2016/ES6 and React,
// we also enable stage 1+ proposals for upcoming ECMAScript features
// so as to enable some of the syntax improvements described in
// https://babeljs.io/blog/2015/06/07/react-on-es6-plus.

gulp.task('examples-js', function() {
  return gulp.src(configJS.src)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', errorHandler)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(configJS.dest));
});

