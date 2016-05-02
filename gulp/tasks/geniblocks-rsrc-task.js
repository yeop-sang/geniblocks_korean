var gulp              = require('gulp');
var config            = require('../config').geniblocksRsrc;

// Copy files directly simple
gulp.task('geniblocks-rsrc', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
