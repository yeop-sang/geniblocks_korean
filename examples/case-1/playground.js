const sexLabels = ['male', 'female'],
      orgAlleleString = "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog";
let   drake = new BioLogica.Organism(BioLogica.Species.Drake, orgAlleleString, 1),
      sexOfDrake = 1;

function render() {
  // change sex buttons
  ReactDOM.render(
    React.createElement(GeniBlocks.ChangeSexButtons, {
          sex: sexLabels[sexOfDrake],
          species: "Drake",
          showLabel: true,
          onChange: function(evt, iSex) {
            // replace alleles lost when switching to male and back
            const alleleString = GeniBlocks.GeneticsUtils.fillInMissingAllelesFromAlleleString(
                                  drake.genetics, drake.getAlleleString(), orgAlleleString);
            sexOfDrake = sexLabels.indexOf(iSex);
            drake = new BioLogica.Organism(BioLogica.Species.Drake, alleleString, sexOfDrake);
            render();
          }
        }),
    document.getElementById('change-sex-buttons')
  );

  // genome
  ReactDOM.render(
    React.createElement(GeniBlocks.GenomeView, {
      org: drake,
      hiddenAlleles: ['t','tk','h','c','a','b','d','bog','rh'],
      style: {marginTop: 50, top: 50},
      alleleChanged: function(chrom, side, prevAllele, newAllele) {
        drake.genetics.genotype.chromosomes[chrom][side].alleles.replaceFirst(prevAllele, newAllele);
        drake = new BioLogica.Organism(BioLogica.Species.Drake, drake.getAlleleString(), sexOfDrake);
        render();
      }
    }),
    document.getElementById('drake-genome')
  );

  // drake
  ReactDOM.render(
    React.createElement(GeniBlocks.OrganismGlowView, {org: drake, color: '#FFFFAA', size: 200}),
    document.getElementById('drake-image'));
}

document.getElementById("advance-button").onclick = function() {
  window.location.assign(window.location.href.replace("playground.html", "challenges.html?challenge=0"));
};

render();
