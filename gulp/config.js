var src = 'src',
    bower = 'bower_components',
    node = 'node_modules',
    examples = 'examples',
    publicRoot  = 'public',
    publicExamples  = 'public/examples',
    publicGeniverse = 'public/gv2',
    dist = 'dist';

module.exports = {
  geniverseJS: {
    watch: [src + '/code/**/*.*'],
    src: src + '/code/app.js',
    public: publicGeniverse + '/js/'
  },
  geniblocksJS: {
    watch: [src + '/code/**/*.*', src + '/resources/authoring/*.*'],
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
    src: [src + '/resources/**/*.*'],
    index: src + '/index.html',
    dest: publicGeniverse + '/resources/',
    destIndex: publicGeniverse
  },
  // this used to use glob negations to select everything EXCEPT .js and .styl, but that's slow, so now
  // we explicitly refer to each filetype we want copied over.
  // https://github.com/benweet/stackedit/pull/550
  examples: {
    watch: [examples + '/**/*.{html,css,png,jpg,ttf,woff}'],
    src: [examples + '/**/*.{html,css,png,jpg,ttf,woff}'],
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
    src: [ bower + '/*/*.js', bower + '/*/*/*.{js,css}' ],
    dest: publicExamples + '/js/lib/'
  },
  vendorGeniverse: {
    src: [ bower + '/biologica.js/dist/*.js' ],
    dest: publicGeniverse + '/js/lib/'
  },
  trim: {
    examples: {
      src: [examples + '/**/*.{html,json}'],
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
    src: publicRoot + '/**/*'
  }
};
