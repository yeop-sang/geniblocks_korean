var gulp        = require('gulp');
var config      = require('../config').examples;

// Copy files directly simple
gulp.task('examples', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
