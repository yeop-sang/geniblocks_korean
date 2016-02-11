var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', function() {
    gulp.watch(config.css.watch,          ['css']);
    gulp.watch(config.browserify.watch,   ['browserify-app']);
    gulp.watch(config.examples.watch,     ['examples']);
});

gulp.task('build-all', ['browserify-app', 'browserify-minify-app', 'vendor', 'css', 'examples']);

gulp.task('default', ['build-all', 'watch']);
