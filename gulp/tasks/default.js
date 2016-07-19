var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', function() {
    gulp.watch(config.geniblocksJS.watch,   ['geni-js']);
    gulp.watch(config.geniblocksCSS.watch,  ['geniblocks-css']);
    gulp.watch(config.geniverseRsrc.watch,  ['geniverse-rsrc']);
    gulp.watch(config.examples.watch,       ['examples', 'examples-css']);
    gulp.watch(config.examplesJS.watch,     ['examples-js']);
});

gulp.task('watch-fast', function() {
    gulp.watch(config.geniblocksJS.watch,   ['geniverse-js-dev']);
    gulp.watch(config.geniblocksCSS.watch,  ['geniblocks-css']);
});

gulp.task('build-all', ['geni-js', 'geniblocks-css', 'geniverse-rsrc',
                        'vendor', 'examples', 'examples-css', 'examples-js']);


// use `gulp` for most GV2 development. It will run faster than `gulp build`
gulp.task('default', ['vendor', 'geniverse-rsrc', 'geniverse-js-dev', 'geniblocks-css', 'watch-fast']);

// use `gulp build` to include examples, GeniBlocks standalone, and minified build products
gulp.task('build', ['build-all', 'watch']);
