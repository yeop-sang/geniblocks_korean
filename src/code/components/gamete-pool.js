const GameteView = require('./gamete');

const GametePoolView = ({gametes, width=300, columns=4, selectedId, onGameteSelected}) => {
  let gameteWidth = width/columns,
      gameteViews = gametes.map((gamete, index) => 
        (<GameteView gamete={gamete} width={gameteWidth}
                      key={index} id={index + 1} // id === index + 1
                      isSelected={index + 1 === selectedId}
                      onClick={onGameteSelected} />));

  return (
    <div className="geniblocks gamete-pool">
      { gameteViews }
    </div>
  );
};

GametePoolView.propTypes = {
  gametes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  width: React.PropTypes.number,
  columns: React.PropTypes.number,
  selectedId: React.PropTypes.number,
  onGameteSelected: React.PropTypes.func
};

export default GametePoolView;
