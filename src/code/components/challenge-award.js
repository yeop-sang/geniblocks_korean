import React, {PropTypes} from 'react';

class ChallengeAwardView extends React.Component {

  static propTypes = {
    challengeAwards: PropTypes.object,
    size: PropTypes.number
  };
   static defaultProps = {
     challengeAwards: {"id":0,"progress":[]},
     size: 80
  }

  render() {
    let challengeId = 0, progress = [];

    if (this.props.challengeAwards) {
      challengeId = this.props.challengeAwards.id;
      progress = this.props.challengeAwards.progress;
    } else return null;

    if (challengeId === 0 || !progress || progress === [])
      return null;

    let baseUrl = `resources/images/challenge${challengeId}`;
    let challengeBackground = `${baseUrl}.png`;
    let size = this.props.size || 80;
    let sizeStyle = {
      width: size + "px",
      height: size + "px"
    };

    let progressImages = [];
    progress.asMutable().map(function(p, i){
      if (p > -1){
        let imgSrc = `${baseUrl}/${i+1}_${p}.png`;
        progressImages.push (<img key={i+1} src={imgSrc} />);
      }
    });

    return (
      <div className="geniblocks challenge-award" style={sizeStyle} >
        <img key={0} src={challengeBackground} />
        {progressImages}
      </div>
    );
  }
}

export default ChallengeAwardView;
