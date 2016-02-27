const GameteView = ({gamete, id, hiddenAlleles=[], location, animStiffness=60, isSelected=false, isDisabled=false, onClick, onRest}) => {

  function handleClick(evt) {
    const elt = evt.target,
          rect = elt.getBoundingClientRect();
    if (!isDisabled) {
      onClick(evt, id, rect);
    }
  }

  function buildTooltipForGamete(gamete) {
    let tooltip = "",
        allHiddenAlleles;
    // Note: it would be more efficient for the caller to pass in the
    // allHiddenAlleles array rather than computing it each time here.
    // But if we moved it out right now we'd have to eliminate the ES6 splat.
    function concatHiddenAlleles(iSpecies, iHiddenAlleles) {
      allHiddenAlleles = [];
      for (const allele of iHiddenAlleles) {
        const gene = BioLogica.Genetics.getGeneOfAllele(iSpecies, allele);
        allHiddenAlleles.push(...gene.alleles);
      }
    }
    for (const ch in gamete) {
      var chromosome = gamete[ch];
      if (allHiddenAlleles == null)
        concatHiddenAlleles(chromosome.species, hiddenAlleles);
      for (const allele of chromosome.alleles) {
        if (allHiddenAlleles.indexOf(allele) < 0) {
          const label = chromosome.species.alleleLabelMap[allele];
          tooltip += (tooltip ? '\n' : '') + ch + ': ' + label;
        }
      }
      if (ch === 'XY') {
        const value = chromosome.side === 'y' ? 'y' : 'x';
        tooltip += (tooltip ? '\n' : '') + ch + ': ' + value;
      }
    }
    return tooltip;
  }

  const selectedClass = isSelected && !isDisabled ? "selected" : "",
        disabledClass = isDisabled ? "disabled" : "",
        group = id % 4,
        rotationForGroup = group * 90,
        classes = `geniblocks gamete ${selectedClass} ${disabledClass} group${group}`,
        initial = location.initial || location.final,
        initialSize = initial.size || 30,
        initialRotation = initial.rotation != null ? initial.rotation : rotationForGroup,
        initialOpacity = initial.opacity != null ? initial.opacity : 1.0,
        final = location.final,
        finalSize = final.size || 30,
        finalRotation = final.rotation != null ? final.rotation : rotationForGroup,
        finalOpacity = final.opacity != null ? final.opacity : 1.0,
        springConfig = { stiffness: animStiffness },
        tooltip = buildTooltipForGamete(gamete);
  /* eslint react/display-name:0 */
  return (
    <ReactMotion.Motion defaultStyle={{ left: initial.x, top: initial.y,
                                        width: initialSize, height: initialSize,
                                        rotation: initialRotation,
                                        opacity: initialOpacity }}
                        style={{left: ReactMotion.spring(final.x, springConfig),
                                top: ReactMotion.spring(final.y, springConfig),
                                width: ReactMotion.spring(finalSize, springConfig),
                                height: ReactMotion.spring(finalSize, springConfig),
                                rotation: ReactMotion.spring(finalRotation, springConfig),
                                opacity: ReactMotion.spring(finalOpacity, springConfig) }}
                        onRest={onRest} >
      {
        interpolatedStyle => {
          var { rotation, ...style } = interpolatedStyle;
          style.transform = `rotate(${rotation}deg)`;
          return (
            <div className={classes} title={tooltip} style={style} onClick={handleClick}>
            </div>
          );
        }
      }
    </ReactMotion.Motion>
  );
};

GameteView.propTypes = {
  gamete: React.PropTypes.object.isRequired,
  hiddenAlleles: React.PropTypes.arrayOf(React.PropTypes.string),
  id: React.PropTypes.number.isRequired,
  location: React.PropTypes.object.isRequired,
  animStiffness: React.PropTypes.number,
  isSelected: React.PropTypes.bool,
  isDisabled: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  onRest: React.PropTypes.func
};

export default GameteView;
