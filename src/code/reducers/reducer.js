import Immutable from 'seamless-immutable';
import { actionTypes } from '../actions';
import { loadStateFromAuthoring, loadNextTrial } from './loadStateFromAuthoring';
import { updateProgress, setProgressScore } from './challengeProgress';

// reducers
import routing from './routing';
import moves from './moves';
import transientStates from './transientStates';
import modalDialog from './modalDialog';
import userDrakeHidden from './userDrakeHidden';
import gametes from './gametes';

const initialState = Immutable({
  template: null,
  drakes: [],
  hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh'],
  trial: 0,
  case: 0,
  challenge: 0,
  challenges: 1,
  challengeProgress: {},
  authoring: window.GV2Authoring
});

export default function reducer(state, action) {
  if (!state) state = initialState;

  state = state.merge({
    routing: routing(state.routing, action),
    moves: moves(state.moves, action),
    transientStates: transientStates(state.transientStates, action),
    modalDialog: modalDialog(state.modalDialog, action),
    userDrakeHidden: userDrakeHidden(state.userDrakeHidden, action),
    gametes: gametes(state.gametes, action)
  });

  switch(action.type) {
    case actionTypes.CHALLENGE_COMPLETE:{
      let progress = setProgressScore(state, 0);

      return state.merge({
        challengeProgress: progress
      });
    }
    case actionTypes.BRED: {
      let mother = new BioLogica.Organism(BioLogica.Species.Drake, action.mother, 1),
          father = new BioLogica.Organism(BioLogica.Species.Drake, action.father, 0),
          children = [];

      for (let i = 0; i < action.quantity; i++) {
        let child = BioLogica.breed(mother, father).getAlleleString();
        children.push(child);
      }

      return state.setIn(["drakes", 1], children);
    }
    case actionTypes.ALLELE_CHANGED: {
      let path = ["drakes", action.index];
      return state.updateIn(path, function(drakeDef) {
        let organism = new BioLogica.Organism(BioLogica.Species.Drake, drakeDef.alleleString, drakeDef.sex);
        organism.genetics.genotype.replaceAlleleChromName(action.chromosome, action.side, action.previousAllele, action.newAllele);
        return {
          alleleString: organism.getAlleleString(),
          sex: organism.sex
        };
      });
    }
    case actionTypes.SEX_CHANGED: {
      let path = ["drakes", action.index, "sex"];
      return state.setIn(path, action.newSex);
    }
    case actionTypes.FERTILIZED: {
      let chromosomes0 = new BioLogica.Organism(BioLogica.Species.Drake, state.drakes[0].alleleString, state.drakes[0].sex).getGenotype().chromosomes,
          chromosomes1 = new BioLogica.Organism(BioLogica.Species.Drake, state.drakes[1].alleleString, state.drakes[1].sex).getGenotype().chromosomes,
          alleleString = "",
          sex = 1;
      for (let name in chromosomes0) {
        let side = state.gametes[1][name];
        let chromosome = chromosomes0[name][side];
        if (chromosome && chromosome.alleles) alleleString += "a:" + chromosome.alleles.join(",a:") + ",";
      }
      for (let name in chromosomes1) {
        let side = state.gametes[0][name];
        if (side === "y") sex = 0;
        let chromosome = chromosomes1[name][side];
        if (chromosome && chromosome.alleles && chromosome.alleles.length) alleleString += "b:" + chromosome.alleles.join(",b:") + ",";
      }

      return state.setIn(["drakes", 2], {
        alleleString,
        sex
      });
    }

    case actionTypes.OFFSPRING_KEPT: {
      if (action.success) {
        state = state.set("drakes", state.drakes.concat({
          alleleString: state.drakes[action.index].alleleString,
          sex: state.drakes[action.index].sex
        }));
        state = state.setIn(["drakes", action.index], null);

        if (state.drakes.length === 8) {
          let challengeComplete = true,
              progress = setProgressScore(state, 0);

          state = state.merge({
            trialSuccess: true,
            challengeProgress: progress,
            challengeComplete
          });
        }
      }
      return state;
    }

    case actionTypes.GAMETES_RESET:
      return state.setIn(["drakes", 2], null);

    case actionTypes.DRAKE_SUBMITTED: {
      let progress = updateProgress(state, action.correct);

      return state.merge({
        trialSuccess: action.correct,
        challengeProgress: progress
      });
    }
    case actionTypes.ADVANCED_TRIAL: {
      if (state.trialSuccess){
        let progress = updateProgress(state, true);
        if (state.trial < state.trials.length - 1) {
          return loadNextTrial(state, action.authoring, progress);
        }
        else {
          return state.merge ({ challengeProgress: progress});
        }
      } else return state;
    }
    case actionTypes.NAVIGATED: {
      state = state.merge({
        case: action.case,
        challenge: action.challenge
      });
      return loadStateFromAuthoring(state, state.authoring, state.challengeProgress);
    }
    case actionTypes.ADVANCED_CHALLENGE: {
      let nextChallenge = state.challenge + 1;
      let progress = updateProgress(state, true);
      return loadStateFromAuthoring(state, action.authoring, nextChallenge, progress);
    }

    default:
      return state;
  }
}
