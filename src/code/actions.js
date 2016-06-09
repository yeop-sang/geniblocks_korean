export function initializeStateFromAuthoring() {
  return {
    type: 'INITIALIZE_STATE_FROM_AUTHORING'
  };
}

export function breed(mother, father, offspringBin, quantity=1) {
  return {
    type: 'BREED',
    mother: mother,
    father: father,
    offspringBin: offspringBin,
    quantity: quantity
  };
}
