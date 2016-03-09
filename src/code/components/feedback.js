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
        textLines = tText.map((iText, index) => <div className="geniblocks feedback text-line" key={index}>{iText}</div>);

  return (
    <div className="geniblocks feedback" style={tStyle}>
      {textLines}
    </div>
  );
};

FeedbackView.propTypes = {
  text: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.arrayOf(React.PropTypes.string)
        ]).isRequired,
  style: React.PropTypes.object
};

export default FeedbackView;
