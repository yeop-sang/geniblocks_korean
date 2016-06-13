import Immutable from 'seamless-immutable';
import { actionTypes } from '../actions';
import GeneticsUtils from '../utilities/genetics-utils';

const initialState = Immutable({
  template: "GenomePlayground",
  drakes: [],
  hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh']
});

export default function reducer(state, action) {
  if (!state) state = initialState;

  switch(action.type) {
    case actionTypes.INITIALIZE_STATE_FROM_AUTHORING: {
      let parents  = [],
          children = [];

      let parent1Def = "a:T,b:T,a:m,b:M,a:W,b:W,a:H,b:h,a:C,b:C,a:b,b:B,a:Fl,b:fl,a:Hl,b:Hl,a:A1,b:A2,a:D,b:dl,a:bog,b:bog,a:rh,b:Rh";
      let parent2Def = "a:Tk,b:T,a:M,b:M,a:w,b:w,a:H,b:H,a:C,b:C,a:b,b:b,a:Fl,b:Fl,a:hl,b:Hl,a:A2,b:a,a:D,a:Bog,a:rh";  
      let parent1 = new BioLogica.Organism(BioLogica.Species.Drake, parent1Def, BioLogica.FEMALE);
      let parent2 = new BioLogica.Organism(BioLogica.Species.Drake, parent2Def, BioLogica.MALE);

      if (initialState.hiddenAlleles.length > 0){
        //debugger;
        parent1Def = GeneticsUtils.filterAlleles(parent1.genetics.genotype.allAlleles, initialState.hiddenAlleles, BioLogica.Species.Drake);
        parent2Def = GeneticsUtils.filterAlleles(parent2.genetics.genotype.allAlleles, initialState.hiddenAlleles, BioLogica.Species.Drake);

        parent1.hiddenAlleles = initialState.hiddenAlleles;
        parent2.hiddenAlleles = initialState.hiddenAlleles;

      }

      parents.push({alleleString:parent1.getAlleleString(),sex:parent1.sex});
      parents.push({alleleString:parent2.getAlleleString(),sex:parent2.sex});

      return state.set("drakes", [parents, children]);
    }
    case actionTypes.BREED: {
      let mother = new BioLogica.Organism(BioLogica.Species.Drake, action.mother, 1),
          father = new BioLogica.Organism(BioLogica.Species.Drake, action.father, 0),
          children = [];

      for (let i = 0; i < action.quantity; i++) {
        let child = BioLogica.breed(mother, father).getAlleleString();
        children.push(child);
      }

      return state.setIn(["drakes", 1], children);
    }
    case actionTypes.CHROMESOME_ALLELE_CHANGED: {
      let organismDef = state.drakes[action.index[0]][action.index[1]].alleleString,
          organismSex = state.drakes[action.index[0]][action.index[1]].sex,
          organism = new BioLogica.Organism(BioLogica.Species.Drake, organismDef, organismSex);
      
      organism.genetics.genotype.replaceAlleleChromName(action.chrom, action.side, action.prevAllele, action.newAllele);
      let allelePath = ["drakes", action.index[0], action.index[1], "alleleString"];

      return state.setIn(allelePath, organism.getAlleleString());
    }
    case actionTypes.SEX_CHANGED: {
      let sexPath = ["drakes", action.index[0], action.index[1], "sex"];
      return state.setIn(sexPath, action.newSex);

    }
    case actionTypes.NAVIGATE_NEXT_CHALLENGE: {
      return state.set("template", "GenomeTarget");
    }

    default:
      return state;
  }
}
