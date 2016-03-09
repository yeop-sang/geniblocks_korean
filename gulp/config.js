var src = './src',
    bower = './bower_components',
    examples = './examples',
    pub  = './public',
    dist = './dist';

module.exports = {
  browserify: {
    watch: [src + '/code/**/*.*'],
    src: src + '/code/app.js',
    public: pub + '/js/',
    dist: dist
  },
  css: {
    watch: src + '/stylus/**/*.styl',
    src:   src + '/stylus/**/*.styl',
    public: pub + '/css/',
    dist: dist
  },
  resources: {
    watch: src + '/resources/**/*.*',
    src: src + '/resources/**/*.*',
    dest: pub + '/resources'
  },
  examples: {
    watch: [examples + '/**/*.*', '!' + examples + '/**/*.js'],
    src: [examples + '/**/*.*', '!' + examples + '/**/*.js'],
    dest: pub
  },
  examplesJS: {
    watch: examples + '/**/*.js',
    src: examples + '/**/*.js',
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
