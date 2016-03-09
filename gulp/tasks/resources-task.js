var gulp              = require('gulp');
var config            = require('../config').resources;

// Copy files directly simple
gulp.task('resources', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
