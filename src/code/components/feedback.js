import {PropTypes} from 'react';

/**
 * Implements a rectangular text area for providing feedback to users, such as
 * that used in Geniverse's challenges for providing trial and goal feedback.
 * Implemented as a React stateless functional component.
 *
 * @param {string|string[]} text - a single or multiple lines of text to display
 * @param {object} style - inline styles applied to the <div> containing each line of text
 */
const FeedbackView = ({text, style={}}) => {
  const tText = Array.isArray(text) ? text : [text],
        lineCount = tText.length,
        height = 20 * lineCount + 2,
        defaultStyle = {
          width: '100%',
          height: height,
          backgroundColor: '#877871',
          color: 'white',
          opacity: 0.8,
          border: '1px solid black',
          textAlign: 'center',
          fontSize: '11pt',
          fontWeight: 'bold'
        },
        tStyle = Object.assign(defaultStyle, style),
        textLines = tText.map((iText, index) => 
                      <div className="geniblocks feedback text-line" key={index}>{iText}</div>);

  return (
    <div className="geniblocks feedback" style={tStyle}>
      {textLines}
    </div>
  );
};

FeedbackView.propTypes = {
  text: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string)
        ]).isRequired,
  style: PropTypes.object
};

export default FeedbackView;
