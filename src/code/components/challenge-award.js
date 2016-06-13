import React, {PropTypes} from 'react';

class ChallengeAwardView extends React.Component {

  static propTypes = {
    challengeProgress: PropTypes.object,
    size: PropTypes.number
  };
   static defaultProps = {
     challengeProgress: {"id":0,"progress":[]},
     size: 80
  }

  render() {
    let challengeId = 0, progress = [];
    if (this.props.challengeProgress){
     challengeId = this.props.challengeProgress.id;
     progress = this.props.challengeProgress.progress;
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
    progress.map(function(p, i){
      if (p > 0){
        let imgSrc = `${baseUrl}_${i+1}_${p}.png`;
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
