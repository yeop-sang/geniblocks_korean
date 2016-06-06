var src = './src',
    bower = './bower_components',
    node = './node_modules',
    examples = './examples',
    publicExamples  = './public/examples',
    dist = './dist';

module.exports = {
  geniblocksJS: {
    watch: [src + '/code/**/*.*'],
    src: src + '/code/geniblocks.js',
    public: publicExamples + '/js/',
    dist: dist
  },
  geniblocksCSS: {
    watch: src + '/stylus/**/*.styl',
    src: [node + '/react-simpletabs/lib/react-simpletabs.css',
          src + '/stylus/**/*.styl'],
    public: publicExamples + '/css/',
    dist: dist
  },
  geniblocksRsrc: {
    watch: src + '/resources/**/*.*',
    src: src + '/resources/**/*.*',
    dest: publicExamples + '/resources'
  },
  examples: {
    watch: [examples + '/**/*.*', '!' + examples + '/**/*.js', '!' + examples + '/**/*.styl'],
    src: [examples + '/**/*.*', '!' + examples + '/**/*.js', '!' + examples + '/**/*.styl'],
    jssrc: [examples + '/experiments/**/*.js'],
    dir: examples,
    dest: publicExamples
  },
  examplesJS: {
    watch: examples + '/**/*.js',
    src: [examples + '/gv2-prototype/gv2.js'],
    dir: examples,
    dest: publicExamples
  },
  vendor: {
    src: [ bower + '/*/*.js', bower + '/*/*/*.js', bower + '/*/*/*.css' ],
    dest: publicExamples + '/js/lib/'
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
    src: publicExamples + '/**/*'
  }
};
