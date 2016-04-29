var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', function() {
    gulp.watch(config.geniblocksJS.watch,   ['geniblocks-js-dev']);
    gulp.watch(config.geniblocksCSS.watch,  ['geniblocks-css']);
    gulp.watch(config.geniblocksRsrc.watch, ['geniblocks-rsrc']);
    gulp.watch(config.examples.watch,       ['examples']);
    gulp.watch(config.examplesJS.watch,     ['examples-js']);
    gulp.watch(config.gv2.watch,            ['gv2']);
    gulp.watch(config.gv2JS.watch,          ['gv2-js']);
});

gulp.task('build-all', ['geniblocks-js', 'geniblocks-css', 'geniblocks-rsrc',
                        'vendor', 'examples', 'examples-js', 'gv2', 'gv2-js']);

gulp.task('default', ['build-all', 'watch']);
