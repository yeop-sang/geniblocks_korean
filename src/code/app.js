/*
 * See https://medium.com/@kentcdodds/misunderstanding-es6-modules-upgrading-babel-tears-and-a-solution-ad2d5ab93ce0#.q1vckffiw
 * (Kent C. Dodds, "Misunderstanding ES6 Modules, Upgrading Babel, Tears, and a Solution")
 * for description of some of the details involved in mixing ES6 export with require().
 */
const
  AlleleFiltersView = require('./components/allele-filters').default,
  AlleleView = require('./components/allele').default,
  AnimatedGameteView = require('./components/animated-gamete').default,
  ChangeSexButtons = require('./components/change-sex-buttons').default,
  ChromosomeImageView = require('./components/chromosome-image').default,
  ChromosomeView = require('./components/chromosome').default,
  CircularGlowView = require('./components/circular-glow').default,
  FeedbackView = require('./components/feedback').default,
  FertilizingGameteView = require('./components/fertilizing-gamete').default,
  GametePoolView = require('./components/gamete-pool').default,
  GameteView = require('./components/gamete').default,
  GeneLabelView = require('./components/gene-label').default,
  GenomeTestView = require('./components/genome-test').default,
  GenomeView = require('./components/genome').default,
  OrganismView = require('./components/organism').default,
  OrganismGlowView = require('./components/organism-glow').default,
  PenView = require('./components/pen').default,
  QuestionGlowView = require('./components/question-glow').default,
  QuestionOrganismGlowView = require('./components/question-organism-glow').default,
  StatsView = require('./components/stats').default;

export {
  AlleleFiltersView,
  AlleleView,
  AnimatedGameteView,
  ChangeSexButtons,
  ChromosomeImageView,
  ChromosomeView,
  CircularGlowView,
  FeedbackView,
  FertilizingGameteView,
  GametePoolView,
  GameteView,
  GeneLabelView,
  GenomeTestView,
  GenomeView,
  OrganismView,
  OrganismGlowView,
  PenView,
  QuestionGlowView,
  QuestionOrganismGlowView,
  StatsView
};
