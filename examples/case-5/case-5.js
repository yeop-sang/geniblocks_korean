var mother = new BioLogica.Organism(BioLogica.Species.Drake, "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog", 1),
    father = new BioLogica.Organism(BioLogica.Species.Drake, "a:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,a:D,a:W,a:fl,b:fl,a:Hl,a:t,b:T,a:rh,a:Bog,b:Bog", 0),
    offspring = [];


function render() {
  // Mother org
  ReactDOM.render(
    React.createElement(GeniBlocks.OrganismView, {org: mother}),
    document.getElementById('mother')
  );
  // Father org
  ReactDOM.render(
    React.createElement(GeniBlocks.OrganismView, {org: father}),
    document.getElementById('father')
  );

  // Mother genome
  ReactDOM.render(
    React.createElement(GeniBlocks.GenomeView, {
      org: mother,
      hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh'],
      alleleChanged: function(chrom, side, prevAllele, newAllele) {
        mother.genetics.genotype.chromosomes[chrom][side].alleles.replaceFirst(prevAllele, newAllele);
        mother = new BioLogica.Organism(BioLogica.Species.Drake, mother.getAlleleString(), 1);
        render();
      }
    }),
    document.getElementById('mother-genome')
  );

  // Breeding pen
  ReactDOM.render(
    React.createElement(GeniBlocks.PenView, {orgs: offspring}),
    document.getElementById('breeding-pen')
  );
}

function breed() {
  var times = 20;
  offspring = [];
  while (times--) {
    offspring.push(BioLogica.breed(mother, father));
  }
  render();
}

document.getElementById("breed-button").onclick = breed;

render();
