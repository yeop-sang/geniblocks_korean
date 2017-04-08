var gulp = require('gulp');
var config = require('../config');
// cwd is required for new/deleted files to be detected (http://stackoverflow.com/a/34346524)
var gazeOptions = { cwd: './' };

gulp.task('watch', function() {
  gulp.watch(config.geniblocksJS.watch, gazeOptions, ['geni-js']);
  gulp.watch(config.geniblocksCSS.watch, gazeOptions, ['geniblocks-css']);
  gulp.watch(config.geniverseRsrc.watch, gazeOptions, ['geniverse-rsrc']);
  gulp.watch(config.examples.watch, gazeOptions, ['examples', 'examples-css']);
  gulp.watch(config.examplesJS.watch, gazeOptions, ['examples-js']);
});

gulp.task('watch-fast', function() {
  gulp.watch(config.geniblocksJS.watch, gazeOptions,  ['geniverse-js-dev']);
  gulp.watch(config.geniblocksCSS.watch, gazeOptions, ['geniblocks-css']);
  // while potentially desirable, resource task is too slow/problematic for 'watch-fast'
  //gulp.watch(config.geniverseRsrc.watch, gazeOptions, ['geniverse-rsrc']);
});

gulp.task('build-all', ['geni-js', 'geniblocks-css', 'geniverse-rsrc',
                        'vendor', 'examples', 'examples-css', 'examples-js']);


// use `gulp` for most GV2 development. It will run faster than `gulp build`
gulp.task('default', ['vendor', 'geniverse-rsrc', 'geniverse-js-dev', 'geniblocks-css', 'watch-fast']);

// use `gulp build` to include examples, GeniBlocks standalone, and minified build products
gulp.task('build', ['build-all', 'watch']);
