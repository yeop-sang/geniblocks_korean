import React, {PropTypes} from 'react';

class ChallengeAwardView extends React.Component {

  static propTypes = {
    challengeAwards: PropTypes.object,
    size: PropTypes.number
  };
   static defaultProps = {
     challengeAwards: {"caseId":0,"challengeId":0,"progress":[]},
     size: 80
  }

  render() {
    let caseId = 0, challengeId = 0, progress = [];

    if (this.props.challengeAwards) {
      caseId = this.props.challengeAwards.caseId,
      challengeId = this.props.challengeAwards.challengeId;
      progress = this.props.challengeAwards.progress;
    } else return null;

    if (challengeId === 0 || !progress || progress === [])
      return null;

    let baseUrl = `resources/images/case${caseId}`;
    let challengeBackground = `${baseUrl}.png`;
    let size = this.props.size || 80;
    let sizeStyle = {
      width: size + "px",
      height: size + "px"
    };

    let progressImages = [];
    let score = -1;
    let pieceKey = caseId + ":" + challengeId;
    for (var key in progress){
      if (key.startsWith(pieceKey)){
        score = progress[key];
      }
    }

    let imgSrc = `${baseUrl}/${challengeId}_${score}.png`;
    progressImages.push (<img key={pieceKey} src={imgSrc} />);

    return (
      <div className="geniblocks challenge-award" style={sizeStyle} >
        <img key={0} src={challengeBackground} />
        {progressImages}
      </div>
    );
  }
}

export default ChallengeAwardView;
