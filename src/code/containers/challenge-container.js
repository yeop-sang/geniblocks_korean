import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import templates from '../templates';
import { changeAllele, changeSex, submitDrake, resetGametes, resetGametePools,
        navigateToCurrentRoute, navigateToChallenge, navigateToNextChallenge,
        addGameteChromosome, addGametesToPool, keepOffspring, fertilize, hatch, completeChallenge,
        changeBasketSelection, changeDrakeSelection, submitEggForBasket } from '../actions';

function hasChangedRouteParams(props) {
  const { case: currCase, challenge: currChallenge, routeParams } = props,
        currCaseStr = String(currCase + 1),
        currChallengeStr = String(currChallenge + 1);
  return (routeParams.case && routeParams.challenge &&
        ((routeParams.case !== currCaseStr) || (routeParams.challenge !== currChallengeStr)));
}

class ChallengeContainer extends Component {

  componentWillMount() {
    const { routeParams, navigateToCurrentRoute, navigateToChallenge } = this.props;
    if (hasChangedRouteParams(this.props)) {
      navigateToCurrentRoute(routeParams.case-1, routeParams.challenge-1);
    } else {
      navigateToChallenge(0, 0);
    }
  }

  componentWillReceiveProps(newProps) {
    const { routeParams, navigateToCurrentRoute } = newProps;
    if (hasChangedRouteParams(newProps)) {
      navigateToCurrentRoute(routeParams.case-1, routeParams.challenge-1);
    }
  }

  render() {
    if (!this.props.template) return null;

    const Template = templates[this.props.template];
    return (
      <div id="challenges" className="case-backdrop">
        <div id="case-wrapper">
          <Template {...this.props} />
        </div>
      </div>
    );
  }

  static propTypes = {
    template: PropTypes.string,
    case: PropTypes.number,
    challenge: PropTypes.number,
    routeParams: PropTypes.shape({
      case: PropTypes.string,
      challenge: PropTypes.string
    }),
    navigateToChallenge: PropTypes.func,
    navigateToCurrentRoute: PropTypes.func
  }
}

function mapStateToProps (state) {
    return {
      template: state.template,
      challengeType: state.challengeType,
      interactionType: state.interactionType,
      instructions: state.instructions,
      showUserDrake: state.showUserDrake,
      drakes: state.drakes,
      gametes: state.gametes,
      gametePools: state.gametePools,
      userChangeableGenes: state.userChangeableGenes,
      visibleGenes: state.visibleGenes,
      hiddenAlleles: state.hiddenAlleles,
      baskets: state.baskets,
      trial: state.trial,
      trials: state.trials,
      case: state.case,
      challenge: state.challenge,
      correct: state.correct,
      errors: state.errors,
      moves: state.moves,
      goalMoves: state.goalMoves,
      userDrakeHidden: state.userDrakeHidden
    };
  }

function mapDispatchToProps(dispatch) {
  return {
    onChromosomeAlleleChange: (index, chrom, side, prevAllele, newAllele) => dispatch(changeAllele(index, chrom, side, prevAllele, newAllele, true)),
    onSexChange: (index, newSex) => dispatch(changeSex(index, newSex, true)),
    onDrakeSubmission: (targetPhenotype, userPhenotype, correct, incorrectAction) =>
      dispatch(submitDrake(targetPhenotype, userPhenotype, correct, incorrectAction)),
    onNavigateNextChallenge: () => dispatch(navigateToNextChallenge()),
    onCompleteChallenge: () => dispatch(completeChallenge()),
    navigateToChallenge: (_case, challenge) => dispatch(navigateToChallenge(_case, challenge)),
    navigateToCurrentRoute: (_case, challenge) => dispatch(navigateToCurrentRoute(_case, challenge)),
    onGameteChromosomeAdded: (index, name, side) => dispatch(addGameteChromosome(index, name, side)),
    onAddGametesToPool: (index, gametes) => dispatch(addGametesToPool(index, gametes)),
    onFertilize: (gamete1, gamete2) => dispatch(fertilize(gamete1, gamete2)),
    onHatch: () => dispatch(hatch()),
    onResetGametes: () => dispatch(resetGametes()),
    onResetGametePools: () => dispatch(resetGametePools()),
    onKeepOffspring: (index, success, maxDrakes) => dispatch(keepOffspring(index, success, maxDrakes)),
    onChangeBasketSelection: (selectedIndices) => dispatch(changeBasketSelection(selectedIndices)),
    onChangeDrakeSelection: (selectedIndices) => dispatch(changeDrakeSelection(selectedIndices)),
    onSubmitEggForBasket: (...args) => dispatch(submitEggForBasket(...args))
  };
}

const Challenge = connect(mapStateToProps, mapDispatchToProps)(ChallengeContainer);

export default Challenge;
