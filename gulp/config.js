var src = './src',
    bower = './bower_components',
    examples = './examples',
    pub  = './public',
    dist = './dist';

module.exports = {
  css: {
    watch: src + '/stylus/**/*.styl',
    src:   src + '/stylus/**/*.styl',
    public: pub + '/css/',
    dist: dist
  },
  browserify: {
    watch: [src + '/code/**/*.*'],
    src: src + '/code/app.js',
    public: pub + '/js/',
    dist: dist
  },
  examples: {
    watch: examples + '/**/*.*',
    src: examples + '/**/*.*',
    dest: pub
  },
  vendor: {
    src: [ bower + '/*/*.js', bower + '/*/*/*.js', bower + '/*/*/*.css' ],
    dest: pub + '/js/lib/'
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
    src: pub + '/**/*'
  }
};
