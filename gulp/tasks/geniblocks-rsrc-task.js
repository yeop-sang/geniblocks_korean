var gulp              = require('gulp');
var blocksConfig      = require('../config').geniblocksRsrc;
var gvConfig          = require('../config').geniverseRsrc;

// Copy files directly simple
gulp.task('geniblocks-rsrc', function() {
  return gulp.src(blocksConfig.src)
    .pipe(gulp.dest(blocksConfig.dest));
});


gulp.task('geniverse-rsrc', function() {
  return gulp.src(gvConfig.src)
    .pipe(gulp.dest(gvConfig.dest));
});

