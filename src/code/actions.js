export const actionTypes = {
  INITIALIZE_STATE_FROM_AUTHORING: "INITIALIZE_STATE_FROM_AUTHORING",
  BREED: "BREED",
  CHROMESOME_ALLELE_CHANGED: "CHROMESOME_ALLELE_CHANGED",
  SEX_CHANGED: "SEX_CHANGED"
};

export function initializeStateFromAuthoring() {
  return {
    type: actionTypes.INITIALIZE_STATE_FROM_AUTHORING
  };
}

export function breed(mother, father, offspringBin, quantity=1) {
  return {
    type: actionTypes.BREED,
    mother,
    father,
    offspringBin,
    quantity
  };
}

export function chromosomeAlleleChange(index, chrom, side, prevAllele, newAllele) {
 return {
    type: actionTypes.CHROMESOME_ALLELE_CHANGED,
    index,
    chrom,
    side,
    prevAllele,
    newAllele
  };
}

export function sexChange(index, newSex) {
  return{
    type: actionTypes.SEX_CHANGED,
    index,
    newSex
  };
}
