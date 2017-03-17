import React, {PropTypes} from 'react';
import BreedButtonView from './breed-button';
import ButtonView from '../components/button';
import OrganismView from '../components/organism';
import classNames from 'classnames';
import t from '../utilities/translate';

function isCompleteChromosomeSet(chromosomes) {
  return chromosomes && (chromosomes.length >= 3) &&
          chromosomes.every((ch) => ch != null);
}

class BreedButtonAreaView extends React.Component {

  static propTypes = {
    isCreationChallenge: PropTypes.bool,
    challengeClasses: PropTypes.string,
    ovumChromosomes: PropTypes.array,
    spermChromosomes: PropTypes.array,
    userDrake: PropTypes.object,
    showUserDrake: PropTypes.bool,
    userDrakeHidden: PropTypes.bool,
    isHatchingInProgress: PropTypes.bool,
    isHatchingComplete: PropTypes.bool,
    onBreed: PropTypes.func,
    onReset: PropTypes.func,
    onSubmit: PropTypes.func
  };

  render() {
    const { isCreationChallenge, challengeClasses, ovumChromosomes, spermChromosomes,
          userDrake, showUserDrake, userDrakeHidden,
          isHatchingInProgress, isHatchingComplete, onBreed, onReset, onSubmit } = this.props,
          // ovumClasses = classNames('ovum', challengeClasses),
          // spermClasses = classNames('sperm', challengeClasses),
          isBreedButtonEnabled = isCompleteChromosomeSet(ovumChromosomes) &&
                                  isCompleteChromosomeSet(spermChromosomes),
          eggClasses = classNames('egg-image', challengeClasses),
          eggImageView = <div className={eggClasses} key={1}/>;
    let userDrakeView = null;

    if (userDrake && isHatchingComplete) {
      const drakeImageView = <OrganismView className="matching" org={userDrake} width={140} key={1} />,
            eggOrDrakeView = showUserDrake || !userDrakeHidden ? drakeImageView : eggImageView,
            saveOrSubmitTitle = isCreationChallenge ? t("~BUTTON.SAVE_DRAKE") : t("~BUTTON.SUBMIT"),
            tryAgainOrResetTitle = isCreationChallenge ? t("~BUTTON.TRY_AGAIN") : t("~BUTTON.RESET");
      userDrakeView = (
        [
          eggOrDrakeView,
          <div className="offspring-buttons" key={2}>
            <ButtonView label={ saveOrSubmitTitle } onClick={ onSubmit } key={3} />
            <ButtonView label={ tryAgainOrResetTitle } onClick={ onReset } key={4} />
          </div>
        ]
      );
    } else {
      if (isHatchingInProgress) {
        userDrakeView = eggImageView;
      } else if (!userDrake) {
        userDrakeView = <BreedButtonView disabled={ !isBreedButtonEnabled } onClick={ onBreed } />;
      }
    }

    return (
      <div className="geniblocks breed-button-area">
        { userDrakeView }
      </div>
    );
  }

}

export default BreedButtonAreaView;
