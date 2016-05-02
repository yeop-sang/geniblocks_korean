var gulp        = require('gulp');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var streamify   = require('gulp-streamify');
var uglify      = require('gulp-uglify');
var stylus      = require('gulp-stylus');
var concat      = require('gulp-concat');
var beep        = require('beepbeep');
var production  = require('../config').production;
var config      = require('../config').gv2;
var configJS    = require('../config').gv2JS;
var configCSS    = require('../config').gv2CSS;

// Copy non-JS/CSS files directly
gulp.task('gv2', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});

/*
 * Stylus --> CSS
 */
gulp.task('gv2-css', function() {
  gulp.src(configCSS.src)
    .pipe(stylus({compress: false}))
    .pipe(concat('gv2.css'))
    .pipe(gulp.dest(configCSS.dest));

  gulp.src(configCSS.src)
    .pipe(stylus({compress: true}))
    .pipe(concat('gv2.min.css'))
    .pipe(gulp.dest(configCSS.dest));
});

/*
 * JS (Browserify)
 */
var errorHandler = function (error) {
  console.log(error.toString());
  beep();
  this.emit('end');
};

gulp.task('gv2-js-dev', function(){
  var b = browserify({
    debug: !production
  })
  .transform(babelify);
  b.add(configJS.src);
  return b.bundle()
    .on('error', errorHandler)
    .pipe(source('gv2.js'))
    .pipe(gulp.dest(configJS.dest));
});

gulp.task('gv2-js-min', function(){
  var b = browserify({
    debug: !production
  })
  .transform(babelify);
  b.add(configJS.src);
  return b.bundle()
    .on('error', errorHandler)
    .pipe(source('gv2.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(configJS.dest));
});

gulp.task('gv2-js', ['gv2-js-dev', 'gv2-js-min']);
