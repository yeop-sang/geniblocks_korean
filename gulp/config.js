var src = './src',
    bower = './bower_components',
    examples = './examples',
    public  = './public',
    dist = './dist';

module.exports = {
  css: {
    watch: src + '/stylus/**/*.styl',
    src:   src + '/stylus/**/*.styl',
    public: public + '/css/',
    dist: dist
  },
  browserify: {
    watch: [src + '/code/**/*.*'],
    src: src + '/code/app.js',
    public: public + '/js/',
    dist: dist
  },
  examples: {
    watch: examples + '/**/*.*',
    src: examples + '/**/*.*',
    dest: public
  },
  vendor: {
    src: bower + '/**/*.js',
    dest: public + '/js/lib/'
  },
  trim: {
    examples: {
      src: [examples + '/**/*.html', examples + '/**/*.json'],
      dest: examples
    },
    code: {
      src: src + '/code/**/*.*',
      dest: src + '/code/'
    },
    stylus: {
      src: src + '/stylus/**/*.*',
      dest: src + '/stylus/'
    }
  },
  deploy: {
    src: public + '/**/*'
  }
};
