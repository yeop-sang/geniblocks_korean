var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', function() {
    gulp.watch(config.browserify.watch,   ['browserify-app']);
    gulp.watch(config.css.watch,          ['css']);
    gulp.watch(config.resources.watch,    ['resources']);
    gulp.watch(config.examples.watch,     ['examples']);
    gulp.watch(config.examplesJS.watch,   ['examplesJS']);
    gulp.watch(config.gv2.watch,          ['gv2']);
    gulp.watch(config.gv2JS.watch,        ['gv2JS']);
});

gulp.task('build-all', ['browserify', 'vendor', 'css', 'resources',
                        'examples', 'examplesJS', 'gv2', 'gv2JS']);

gulp.task('default', ['build-all', 'watch']);
