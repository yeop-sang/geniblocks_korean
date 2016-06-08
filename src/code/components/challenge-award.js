import {PropTypes} from 'react';

class AwardView extends React.Component {

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
    
    let baseUrl = `http://127.0.0.1:8080/gv2/images/challenge${challengeId}`;
    let challengeBackground = `${baseUrl}.png`;
    let size = this.props.size || 80;
    var sizeStyle = {
      width: size + "px",
      height: size + "px"
    };
    
    var progressImages = [];
    progress.map(function(p, i){
      if (p > 0){
        var imgSrc = `${baseUrl}_${i+1}_${p}.png`;
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

export default AwardView;