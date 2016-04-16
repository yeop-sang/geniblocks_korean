var gulp              = require('gulp');
var beep              = require('beepbeep');
var babel             = require('gulp-babel');
var sourcemaps        = require('gulp-sourcemaps');
var gv2Config         = require('../config').gv2;
var gv2JSConfig       = require('../config').gv2JS;

// Copy non-JS files directly
gulp.task('gv2', function() {
  return gulp.src(gv2Config.src)
    .pipe(gulp.dest(gv2Config.dest));
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

gulp.task('gv2JS', function(){
  return gulp.src(gv2JSConfig.src)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', errorHandler)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(gv2JSConfig.dest));
});

