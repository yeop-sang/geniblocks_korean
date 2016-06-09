var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', function() {
    gulp.watch(config.geniblocksJS.watch,   ['geni-js']);
    gulp.watch(config.geniblocksCSS.watch,  ['geniblocks-css']);
    gulp.watch(config.geniverseRsrc.watch,  ['geniverse-rsrc']);
    gulp.watch(config.examples.watch,       ['examples', 'examples-css']);
    gulp.watch(config.examplesJS.watch,     ['examples-js']);
});

gulp.task('build-all', ['geni-js', 'geniblocks-css', 'geniverse-rsrc',
                        'vendor', 'examples', 'examples-css', 'examples-js']);

gulp.task('default', ['build-all', 'watch']);
