var mother = new BioLogica.Organism(BioLogica.Species.Drake, "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog", 1),
    father = new BioLogica.Organism(BioLogica.Species.Drake, "a:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,a:D,a:W,a:fl,b:fl,a:Hl,a:t,b:T,a:rh,a:Bog,b:Bog", 0),
    offspring = [],
    clutch = [],
    clutchSize = 20;

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
        clutch = [];
        offspring = [];
        render();
      }
    }),
    document.getElementById('mother-genome')
  );

  // Breeding pen
  /* global ReactSimpleTabs */
  var rce = React.createElement,
      Tabs = ReactSimpleTabs;
  ReactDOM.render(
    rce(Tabs, null, [
      rce(Tabs.Panel, { title: "Breeding Pen", key: "Breeding Pen" },
        rce(GeniBlocks.PenView, {orgs: clutch})),
      rce(Tabs.Panel, { title: "Stats", key: "Stats" },
        rce(GeniBlocks.StatsView, {orgs: offspring, lastClutchSize: clutchSize}))
    ]),
    document.getElementById('breeding-pen')
  );
}

function breed() {
  var times = clutchSize;
  clutch = [];
  while (times--) {
    var child = BioLogica.breed(mother, father);
    clutch.push(child);
    offspring.push(child);
  }
  render();
}

document.getElementById("breed-button").onclick = breed;

render();
