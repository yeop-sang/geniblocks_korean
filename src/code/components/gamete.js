const GameteView = ({gamete, id, width=200, isSelected, onClick}) => {
  gamete, width;

  function handleClick(evt) {
    onClick(evt, id);
  }

  const classes = `geniblocks gamete ${isSelected ? "selected" : ""} ${'group' + (id % 4)}`;
  return (
    <div className={classes} onClick={handleClick}>
    </div>
  );
};

GameteView.propTypes = {
  gamete: React.PropTypes.object.isRequired,
  id: React.PropTypes.number.isRequired,
  width: React.PropTypes.number,
  isSelected: React.PropTypes.bool,
  onClick: React.PropTypes.func
};

export default GameteView;
