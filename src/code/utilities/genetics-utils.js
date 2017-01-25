/**
 * Class providing utility functions for BioLogica genetics operations.
 * In some cases these are adapted from corresponding code in Geniverse.
 */
export default class GeneticsUtils {

  /**
   * Converts allele strings in the new dash form (e.g. "W-w, T-, -a") to the original
   * BioLogica a:b: form (e.g. "a:W,b:w,a:T,b:a")
   *
   * @param {string}  dashAlleleString - the allele string to be converted
   * @returns {string}  the converted allele string
   */
  static convertDashAllelesToABAlleles(dashAlleleString) {
    if (!dashAlleleString || (dashAlleleString.indexOf(':') >= 0) || (dashAlleleString.indexOf('-') < 0))
      return dashAlleleString;
    const dashAlleles = dashAlleleString.split(',');
    return dashAlleles.reduce((prev, pair) => {
                        const alleles = pair.trim().split('-');
                        if (alleles[0]) prev += `${prev ? ',' : ''}a:${alleles[0].trim()}`;
                        if (alleles[1]) prev += `${prev ? ',' : ''}b:${alleles[1].trim()}`;
                        return prev;
                      }, "");
  }

  /**
   * Converts allele strings in the new dash form (e.g. "W-w, T-, -a") to the original
   * BioLogica a:b: form (e.g. "a:W,b:w,a:T,b:a") within objects and arrays.
   *
   * Recurses through nested objects/arrays converting dash allele strings in properties
   * whose names are white-listed in the propNames argument.
   *
   * @param {object}  object - the object to be converted
   * @returns {object}  the same object is returned with the specified fields modified
   */
  static convertDashAllelesObjectToABAlleles(object, propNames) {
    if (!object || !propNames || (propNames.length == null)) return object;

    function convertValue(key, value) {
      if (!value) return value;
      switch (typeof value) {
        case 'string':
          return (!key || (propNames.indexOf(key) >= 0))
                    ? GeneticsUtils.convertDashAllelesToABAlleles(value)
                    : value;
        case 'object':
          if (Array.isArray(value)) {
            // note that the key for strings in arrays is the key for the array
            return value.map((item) => convertValue(key, item));
          }
          else {
            for (let objKey in value) {
              value[objKey] = convertValue(objKey, value[objKey]);
            }
          }
          return value;
        default:
          return value;
      }
    }

    return convertValue(null, object);
  }

  static ensureValidOrganism(orgOrDef, species=BioLogica.Species.Drake) {
    if (orgOrDef.getAlleleString) {
      return orgOrDef;
    }
    return new BioLogica.Organism(species, orgOrDef.alleleString, orgOrDef.sex);
  }

  /**
   * Returns true if the specified alleles are present in the allele string.
   *
   * @param {string}  alleleString - organism allele string
   * @param (string)  alleles - alleles to match against the organism alleles
   * @returns {boolean} true if the alleles are present in the alleleString, false otherwise
   */
  static alleleStringContainsAlleles(alleleString, alleles) {
    // empty strings don't match
    if (!alleleString || !alleles) return false;
    // must match every one of the alleles ...
    return alleles.split(',').every((allele) => {
      // ... to the alleles of the alleleString
      return alleleString.search(`${allele}(,|$)`) >= 0;
    });
  }

  /**
   * Returns true if the specified allele string contains only valid alleles
   *
   * @param {string}  alleleString - the allele string (in a:b: form) to be validated
   * @param {object}  [species] - the species whose genome is used to determine completeness
   * @returns         true if the allele string is valid, false otherwise
   */
  static isValidAlleleString(alleleString, species=BioLogica.Species.Drake) {
    if (!species || !alleleString) return false;
    const alleleToGeneMap = Object.keys(species.geneList).reduce((prev, gene) => {
                              species.geneList[gene].alleles.forEach((allele) => {
                                prev[allele] = gene;
                              });
                              return prev;
                            }, {});
    return alleleString.split(',').every((alleleSide) => {
            const [side, allele] = alleleSide.split(':');
            return ((side.trim() === 'a') || (side.trim() === 'b')) &&
                    (alleleToGeneMap[allele.trim()] != null);
          });
  }

  /**
   * Returns true if the specified allele string completely specifies all alleles
   *
   * To be complete, every gene must be specified with a valid allele for each
   * side (except sex-linked genes, which need only be on one side), and no
   * invalid alleles or genes can be specified.
   *
   * @param {string}  alleleString - the allele string (in a:b: form) to be validated
   * @param {object}  [species] - the species whose genome is used to determine completeness
   * @returns         true if the allele string is complete, false otherwise
   */
  static isCompleteAlleleString(alleleString, species=BioLogica.Species.Drake) {
    if (!species || !alleleString) return false;
    const kUnknownGene = "__UNKNOWN__",
          alleleToGeneMap = Object.keys(species.geneList).reduce((prev, gene) => {
                              species.geneList[gene].alleles.forEach((allele) => {
                                prev[allele] = gene;
                              });
                              return prev;
                            }, {}),
          speciesGeneCount = Object.keys(species.geneList).length,
          geneSideMap = alleleString.split(',').reduce((prev, alleleSide) => {
                          const [side, allele] = alleleSide.split(':');
                          let gene = alleleToGeneMap[allele.trim()];
                          if (!gene) gene = kUnknownGene;
                          let geneEntry = prev[gene];
                          if (!geneEntry) geneEntry = prev[gene] = { a: 0, b: 0 };
                          ++ geneEntry[side.trim()];
                          return prev;
                        }, {}),
          alleleStringGeneCount = Object.keys(geneSideMap).length,
          isEveryGeneComplete = Object.keys(geneSideMap).every((gene) => {
                                  const geneEntry = geneSideMap[gene],
                                        isXYGene = species.chromosomeGeneMap.XY.some((allele) =>
                                                    gene === alleleToGeneMap[allele]);
                                  return geneEntry && ((geneEntry.a === 1) && (geneEntry.b === 1)) ||
                                          (isXYGene &&
                                            (geneEntry.a + geneEntry.b >= 1) && (geneEntry.a + geneEntry.b <= 2));
                                });
    // must have the correct number of genes, all genes must be complete, and no unknown genes
    return (speciesGeneCount === alleleStringGeneCount) && isEveryGeneComplete &&
            (geneSideMap[kUnknownGene] == null);
  }

  /**
   * Filters out hidden alleles, given a list of changeable and visible genes.
   * Returns array of objects with the allele and the editability
   *
   * @param {string[]} alleles - the set of alleles to be filtered
   * @param {string[]} userChangeableGenes - genes that the user can edit (if the template allows)
   * @param {string[]} visibleGenes - genes that the user can view (already includes the above list)
   * @param {BioLogica.species} species - the species that defines the genotype
   * @return {obj[]} - the filtered alleles, where each is an object with a name and whether it is editable
   */
  static filterVisibleAlleles(alleles, userChangeableGenes, visibleGenes, species) {
    let showAll = userChangeableGenes.length + visibleGenes.length === 0;
    return alleles.filter(a => {
      if (showAll) return true;

      const gene = BioLogica.Genetics.getGeneOfAllele(species, a),
            geneName = gene ? gene.name : null;
      return userChangeableGenes.indexOf(geneName) > -1 || visibleGenes.indexOf(geneName) > -1;
    }).map(a => ({
      allele: a,
      editable: userChangeableGenes.indexOf(BioLogica.Genetics.getGeneOfAllele(species, a).name) > -1
    }));
  }

  /**
   * Compute a map of traits -> traitValues -> traitCounts.
   *
   * @param {BioLogica.Organism[]} organisms - the set of organisms to compute stats for
   * @param {number} clutchSize - the last 'clutchSize' organisms are assumed to be the last clutch
   * @return {Map} - e.g. { "tail": { "long tail": { "clutch": [9, 11], "total": [53, 47] }}}
   */
  static computeTraitCountsForOrganisms(organisms, lastClutchSize) {
    let traits = new Map,
        clutchSize = lastClutchSize || organisms.length;

    // accumulate stats for each trait/value combination
    for (const [index, org] of organisms.entries()) {
      for (const trait of Object.keys(org.phenotype.characteristics)) {
        let value = org.phenotype.characteristics[trait],
            traitValues = traits.get(trait) || new Map,
            valueCounts = traitValues.get(value) || { clutch: [0, 0], total: [0, 0] };
        if (!traits.has(trait)) traits.set(trait, traitValues);
        if (!traitValues.has(value)) traitValues.set(value, valueCounts);
        // most recent clutch assumed to be at end of organisms array
        if (index >= organisms.length - clutchSize)
          ++ valueCounts.clutch[org.sex];
        ++ valueCounts.total[org.sex];
      }
    }
    return traits;
  }

  /**
   * Converts an allele string to a JavaScript object that maps genes to alleles.
   * This can be useful for comparison purposes, for instance.
   *
   * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
   * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
   * @return {object} - gene map of form { horns: {a:"h", b:"h"}, armor: {a:"a", b:"a"}, ...}
   */
  static buildGeneMapFromAlleleString(genetics, alleleString) {
    let geneMap = {},
        alleleSubstrings = alleleString.split(",");
    for (const alleleSubstr of alleleSubstrings) {
      const [side, allele] = alleleSubstr.split(":"),
            gene = genetics.geneForAllele(allele);
      if (side && allele && gene) {
        if (!geneMap[gene]) geneMap[gene] = {};
        geneMap[gene][side] = allele;
      }
    }
    return geneMap;
  }

  /**
   * Given an allele string and a gene map defining a set of base (default) alleles,
   * returns a new allele string with missing alleles replaced by their defaults.
   *
   * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
   * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
   * @param {object} baseGeneMap - gene map of form { horn: {a:"h", b:"h"}, armor: {a:"a", b:"a"}, ...}
   * @return {string} - updated allele string of form "a:h,b:h,a:a,b:a..."
   */
  static fillInMissingAllelesFromGeneMap(genetics, alleleString, baseGeneMap) {
    const dstGeneMap = GeneticsUtils.buildGeneMapFromAlleleString(genetics, alleleString);
    let   dstAlleleString = alleleString;
    for (const gene in dstGeneMap) {
      const geneValue = dstGeneMap[gene];
      // replace a missing 'a' side allele with the default if appropriate
      if (!geneValue.a && baseGeneMap[gene] && baseGeneMap[gene].a) {
        dstAlleleString = dstAlleleString.replace(`b:${geneValue.b}`, `a:${baseGeneMap[gene].a},$&`);
      }
      // replace a missing 'b' side allele with the default if appropriate
      if (!geneValue.b && baseGeneMap[gene] && baseGeneMap[gene].b) {
        dstAlleleString = dstAlleleString.replace(`a:${geneValue.a}`, `$&,b:${baseGeneMap[gene].b}`);
      }
    }
    return dstAlleleString;
  }

  /**
   * Given two allele strings, returns a new allele string in which missing alleles
   * in the first are replaced by defaults provided by the second allele string.
   *
   * @param {BioLogica.Genetics} genetics - genetics object to use for gene mapping
   * @param {string} alleleString - allele string of form "a:h,b:h,a:a,b:a..." to be modified
   * @param {string} baseAlleleString - allele string of form "a:h,b:h,a:a,b:a..." to use as defaults
   * @return {string} - updated allele string of form "a:h,b:h,a:a,b:a..."
   */
  static fillInMissingAllelesFromAlleleString(genetics, alleleString, baseAlleleString) {
    const baseGeneMap = GeneticsUtils.buildGeneMapFromAlleleString(genetics, baseAlleleString);
    return GeneticsUtils.fillInMissingAllelesFromGeneMap(genetics, alleleString, baseGeneMap);
  }

  static numberOfBreedingMovesToReachDrake(organism1, organism2, changeableAlleles1, changeableAlleles2, targetOrganism) {
    var moves = 0,
        org1Alleles = organism1.getAlleleString().split(',').map(a => a.split(':')[1]),
        org2Alleles = organism2.getAlleleString().split(',').map(a => a.split(':')[1]),
        targetchars = targetOrganism.phenotype.characteristics,
        traitRules = organism1.species.traitRules;

    for (var trait in traitRules) {
      if (traitRules.hasOwnProperty(trait)) {
        var possibleSolutions = traitRules[trait][targetchars[trait]],
            shortestPath = Infinity;
        if (possibleSolutions && possibleSolutions.length) {
          for (var i = 0, ii = possibleSolutions.length; i<ii; i++) {
            var solution = possibleSolutions[i],
                movesForSolution1 = 0,
                movesForSolution2 = 0;
            for (var j = 0, jj = solution.length; j<jj; j++) {
              var allele1 = solution[j],
                  allele2 = j%2 === 0 ? solution[j+1] : solution[j-1],
                  solutionMoves = 0;
              if (org1Alleles.indexOf(allele1) === -1) {
                if (allele1 && (changeableAlleles1.indexOf(allele1) > -1 ||
                    changeableAlleles1.indexOf(allele1.toLowerCase()) > -1)) {
                  solutionMoves++;
                } else {
                  solutionMoves = Infinity;
                }
              }

              if (org2Alleles.indexOf(allele2) === -1) {
                if (allele2 && (changeableAlleles2.indexOf(allele2) > -1 ||
                      changeableAlleles2.indexOf(allele2.toLowerCase()) > -1)) {
                  solutionMoves++;
                } else {
                  solutionMoves = Infinity;
                }
              }

              if (j%2 === 0) {
                movesForSolution1 += solutionMoves;
              } else {
                movesForSolution2 += solutionMoves;
              }
            }
            shortestPath = Math.min(shortestPath, Math.min(movesForSolution1, movesForSolution2));
          }
          moves += shortestPath;
        }
      }
    }

    return moves;
  }

  /**
   * Returns the number of separate changes, including allele changes and sex changes,
   * required to match the phenotype of the 'testOrganism' to that of the 'targetOrganism'.
   *
   * @param {BioLogica.Organism} testOrganism - the organism to which changes would apply
   * @param {BioLogica.Organism} targetOrganism - the organism that serves as destination
   * @return {number} - the total number of changes required for the phenotypes to match
   */
  static numberOfChangesToReachPhenotype(testOrganism, targetOrganism) {
    testOrganism = this.ensureValidOrganism(testOrganism);
    targetOrganism = this.ensureValidOrganism(targetOrganism);

    let requiredChangeCount = GeneticsUtils.numberOfAlleleChangesToReachPhenotype(
                                              testOrganism.phenotype.characteristics,
                                              targetOrganism.phenotype.characteristics,
                                              testOrganism.genetics.genotype.allAlleles,
                                              testOrganism.species.traitRules);
    if (testOrganism.sex !== targetOrganism.sex)
      ++requiredChangeCount;

    return requiredChangeCount;
  }

  /**
   * Returns the number of separate allele changes required to make the phenotype of
   * the organism characterized by 'testCharacterstics' match that of the organism
   * characterized by 'targetCharacteristics'. Adapted from:
   * @see https://github.com/concord-consortium/Geniverse-SproutCore/blob/master/frameworks/geniverse/controllers/match.js
   *
   * @param {object} testCharacteristics - the characteristics of the test organism
   * @param {object} targetCharacteristics - the characteristics of the target organism
   * @param {string[]} testAlleles - the array of alleles of the test organism
   * @param {object} traitRules - the traitRules of the BioLogica.Species of the organisms
   * @return {number} - the number of allele changes required for the phenotypes to match
   */
  static numberOfAlleleChangesToReachPhenotype(testCharacteristics, targetCharacteristics, testAlleles, traitRules) {
    const alleles = testAlleles;
    let   moves = 0;

    for (const trait in traitRules) {
      if (traitRules.hasOwnProperty(trait)) {
        if (testCharacteristics[trait] !== targetCharacteristics[trait]) {
          // first we have to work out what alleles the original drake has that correspond to
          // their non-matching trait
          const possibleTraitAlleles = GeneticsUtils.collectAllAllelesForTrait(trait, traitRules);
          let   characteristicAlleles = [];
          for (let i = 0, ii = alleles.length; i < ii; i++) {
            if (possibleTraitAlleles.indexOf(alleles[i]) >= 0){
              characteristicAlleles.push(alleles[i]);
            }
          }
          // now work out the smallest number of steps to get from there to the desired characteristic
          const possibleSolutions = traitRules[trait][targetCharacteristics[trait]];
          let   shortestPathLength = Infinity;
          for (let i = 0, ii = possibleSolutions.length; i < ii; i++) {
            let solution = possibleSolutions[i].slice(),
                pathLength = 0;
            for (let j = 0, jj = characteristicAlleles.length; j < jj; j++){
              if (solution.indexOf(characteristicAlleles[j]) === -1){
                pathLength++;
              } else {
                solution.splice(solution.indexOf(characteristicAlleles[j]), 1); // already matched this one, can't match it again
              }
            }
            shortestPathLength = (pathLength < shortestPathLength) ? pathLength : shortestPathLength;
          }
          moves += shortestPathLength;
        }
      }
    }
    return moves;
  }

  /**
   * Goes through the traitRules to find out what unique alleles are associated with each trait
   * e.g. For "tail" it will return ["T", "Tk", "t"]. Adapted from:
   * @see https://github.com/concord-consortium/Geniverse-SproutCore/blob/master/frameworks/geniverse/controllers/match.js
   *
   * @param {string} trait - name of trait, e.g. "tail"
   * @param {object} traitRules - the traitRules of the BioLogica.Species whose traits are of interest
   * @return {string[]} - array of allele strings, e.g. ["T", "Tk", "t"]
   */
  static _possibleAllelesForTrait = {};
  static collectAllAllelesForTrait(trait, traitRules) {
    if (GeneticsUtils._possibleAllelesForTrait[trait]) {
      return GeneticsUtils._possibleAllelesForTrait[trait];
    }

    let allelesHash = {},
        alleles     = [];
    for (const characteristic in traitRules[trait]){
        for (const possibileAllelesCombo in traitRules[trait][characteristic]) {
          if (traitRules[trait][characteristic].hasOwnProperty(possibileAllelesCombo)){
            for (let i = 0, ii = traitRules[trait][characteristic][possibileAllelesCombo].length; i < ii; i++) {
              allelesHash[traitRules[trait][characteristic][possibileAllelesCombo][i]] = 1;
            }
          }
        }
    }

    for (const allele in allelesHash){
      alleles.push(allele);
    }

    GeneticsUtils._possibleAllelesForTrait[trait] = alleles;  // store so we don't need to recalculate it
    return alleles;
  }
}
