import React, {PropTypes} from 'react';
import FVEggHatchView from '../fv-components/fv-egg-hatch';
import classNames from 'classnames';

const ClutchView = React.createClass({

  propTypes: {
    className: PropTypes.string,
    orgs: PropTypes.arrayOf(PropTypes.object).isRequired,
    idPrefix: PropTypes.string,
    height: PropTypes.number,
    onClick: PropTypes.func
  },

  getDefaultProps() {
    return ({
      idPrefix: 'organism-',
      height: 218
    });
  },

  getInitialState() {
    return { page : 0 };
  },

  handleClick(id, org) {
    const prefixIndex = id.indexOf(this.props.idPrefix),
          index = Number(id.substr(prefixIndex + this.props.idPrefix.length));
    if (this.props.onClick) this.props.onClick(index, id, org);
  },

  handlePageBackward() {
    this.setState({page: Math.max(this.state.page - 1, 1)});
  },

  handlePageForward() {
    const numPages = this.props.orgs.length / 8;
    this.setState({page: Math.min(this.state.page + 1, numPages)});
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.orgs.length === 0) {
      this.setState({page: 0});
    }
    if (nextProps.orgs.length > this.props.orgs.length) {
      // Move to the end whenever a new clutch is bred
      const numPages = nextProps .orgs.length / 8;
      this.setState({page: numPages});
    }
  },

  render() {
    let displayStyle = {size: 136, top: -153, marginLeft: -12},
        firstDrake = (this.state.page - 1) * 8,
        pageDrakes = this.props.orgs.slice(firstDrake, firstDrake + 8),
        stableDrakeViews = pageDrakes.map((org, index) => {
          return (
            <div className="stable-drake-overlay" style={{width: 116}}>
              <FVEggHatchView organism = {org} id={this.props.idPrefix + index} onClick={this.handleClick} eggStyle={{left: -477, top: -424}} displayStyle={displayStyle}/>
            </div>
          );
        });
    const classes = classNames('geniblocks clutch-view', this.props.className);
    const maxPages = this.props.orgs.length / 8;

    return (
      <div className={classes}>
        <div className="clutch-page-counter clutch-counter">
          <div className="clutch-page-text">Clutch:</div>
          <div className="clutch-page-count">{this.state.page + " / " + maxPages}</div>
        </div>
        <div className="drake-pages">
          <div className="clutch-slider left" onClick={this.handlePageBackward}></div>
          <div className="clutch-drakes">
            { stableDrakeViews }
          </div>
          <div className="clutch-slider right" onClick={this.handlePageForward}></div>
        </div>
      </div>
    );
  }
});

export default ClutchView;
