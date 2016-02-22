var mother;

function render() {
  ReactDOM.render(
    React.createElement(GeniBlocks.OrganismView, {org: mother}),
    document.getElementById('mother')
  );
  ReactDOM.render(
    React.createElement(GeniBlocks.GenomeView, {
      org: mother,
      hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh'],
      alleleChanged: function(chrom, side, prevAllele, newAllele) {
      dragon.genetics.genotype.chromosomes[chrom][side].alleles.replaceFirst(prevAllele, newAllele);
      render();
    }}),
    document.getElementById('mother-genome')
  );
}

mother = new BioLogica.Organism(BioLogica.Species.Drake, "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog", 1);

render();
