import React, {PropTypes} from 'react';
import BreedButtonView from './breed-button';
import OrganismView from '../components/organism';
import classNames from 'classnames';

function isCompleteChromosomeSet(chromosomes) {
  return chromosomes && (chromosomes.length >= 3) &&
          chromosomes.every((ch) => ch != null);
}

class BreedButtonAreaView extends React.Component {

  static propTypes = {
    challengeClasses: PropTypes.string,
    ovumChromosomes: PropTypes.array,
    spermChromosomes: PropTypes.array,
    userDrake: PropTypes.object,
    showUserDrake: PropTypes.bool,
    userDrakeHidden: PropTypes.bool,
    isHatchingInProgress: PropTypes.bool,
    isHatchingComplete: PropTypes.bool,
    onBreed: PropTypes.func
  };

  render() {
    const { challengeClasses, ovumChromosomes, spermChromosomes,
          userDrake, showUserDrake, userDrakeHidden,
          isHatchingInProgress, isHatchingComplete, onBreed } = this.props,
          // ovumClasses = classNames('ovum', challengeClasses),
          // spermClasses = classNames('sperm', challengeClasses),
          isBreedButtonEnabled = isCompleteChromosomeSet(ovumChromosomes) &&
                                  isCompleteChromosomeSet(spermChromosomes),
          eggClasses = classNames('egg-image', challengeClasses),
          eggImageView = <div className={eggClasses} key={1}/>;
    let userDrakeView = null;

    if (userDrake && isHatchingComplete) {
      const drakeImageView = <OrganismView className="matching" org={userDrake} width={180} key={1} />,
            eggOrDrakeView = showUserDrake || !userDrakeHidden ? drakeImageView : eggImageView;
      userDrakeView = eggOrDrakeView;
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
