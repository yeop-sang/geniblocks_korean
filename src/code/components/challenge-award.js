import React, {PropTypes} from 'react';

class ChallengeAwardView extends React.Component {

  static propTypes = {
    challengeAwards: PropTypes.object,
    size: PropTypes.number,
    coinParts: PropTypes.number
  };

  static defaultProps = {
     challengeAwards: {"caseId":0, "challengeId":0, "challengeCount":0, "progress":[]},
     size: 256,
     coinParts: 3
  };

  addAwardImage = (progressImages, pieces, pieceNum, score, coinStyle, pieceStyle) => {
    let awardLevel = "gold";
    if (score === 1) awardLevel = "silver";
    if (score >= 2) awardLevel = "bronze";
    let pieceName = `coin piece pieces${pieces} piece${pieceNum} ${pieceStyle} ${awardLevel}`;
    progressImages.push(<div key={pieceNum} className={pieceName} style={coinStyle} />);
    return progressImages;
  };

  render() {
    let caseId = 0, challengeId = 0, challengeCount = 0, progress = [], challengeBackgroundImage, progressImages = [];
    console.log(this.props);
    if (this.props.challengeAwards.challengeId) {
      caseId = this.props.challengeAwards.caseId,
      challengeId = this.props.challengeAwards.challengeId,
      challengeCount = this.props.challengeAwards.challengeCount;
      progress = this.props.challengeAwards.progress;
      challengeBackgroundImage = <div className="coin" />;
    } else return null;

    if (!progress || progress === [])
      return null;
    
    let size = this.props.size || 256;
    let sizeStyle = {
      width: size + "px",
      height: size + "px"
    };

    let coinStyle = {
      backgroundImage: `url(../resources/images/coin-pieces-${challengeCount}.png)`
    };

    let pieceKey = caseId + ":";
    let challengeScore = {};

    // if all challenges in case completed, show all coin pieces
    let showAllPieces = challengeId === challengeCount;

    for (let i = 0; i < challengeCount; i++){
      for (var key in progress){
        if (key.startsWith(pieceKey + i)){
          let score = progress[key];
          let currentScore = challengeScore[i];
          if (!currentScore) {
             challengeScore[i] = score;
          } else {
            currentScore = currentScore + score;
            challengeScore[i] = score;
          }
        }
      }
    }

    if (showAllPieces){
      for (var challenge in challengeScore){
          progressImages = this.addAwardImage(progressImages, challengeCount, challenge, challengeScore[challenge], coinStyle, "whole");
      }
    } else {
      progressImages = this.addAwardImage(progressImages, challengeCount, challengeId, challengeScore[challengeId], coinStyle, "single");
    }

    return (
      <div className="geniblocks challenge-award" style={sizeStyle} >
        {challengeBackgroundImage}
        {progressImages}
      </div>
    );
  }
}

export default ChallengeAwardView;
