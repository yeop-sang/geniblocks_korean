var src = './src',
    bower = './bower_components',
    node = './node_modules',
    examples = './examples',
    publicExamples  = './public/examples',
    publicGeniverse = './public/gv2',
    dist = './dist';

module.exports = {
  geniverseJS: {
    watch: [src + '/code/**/*.*'],
    src: src + '/code/app.js',
    public: publicGeniverse + '/js/'
  },
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
    publicGV: publicGeniverse + '/css/',
    dist: dist
  },
  geniverseRsrc: {
    watch: [src + '/index.html', src + '/resources/**/*.*'],
    src: [src + '/index.html', src + '/resources/**/*.*'],
    dest: publicGeniverse + '/resources/'
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
  vendorExamples: {
    src: [ bower + '/*/*.js', bower + '/*/*/*.js', bower + '/*/*/*.css' ],
    dest: publicExamples + '/js/lib/'
  },
  vendorGeniverse: {
    src: [ bower + '/biologica.js/dist/*.js' ],
    dest: publicGeniverse + '/js/lib/'
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
