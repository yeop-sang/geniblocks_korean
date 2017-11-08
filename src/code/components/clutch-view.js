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
    return { page : 0, tempDisabled: false };
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
    const handleClick = this.props.onClick ? (id, org) => {
      let _this = this;
      if (!_this.state.tempDisabled) {
        const prefixIndex = id.indexOf(_this.props.idPrefix),
              indexOnPage = Number(id.substr(prefixIndex + _this.props.idPrefix.length)),
              index = ((_this.state.page-1) * 8) + indexOnPage;

        _this.props.onClick(index, id, org);

        // Disable clicks for a bit to avoid mass submissions
        _this.setState({tempDisabled: true});
        setTimeout(function() {
          _this.setState({tempDisabled: false});
        }, 2000);
      }
    } : null;

    let displayStyle = {size: 170, top: -35, marginLeft: 0, marginTop: 0},
        firstDrake = (this.state.page - 1) * 8,
        pageDrakes = this.props.orgs.slice(firstDrake, firstDrake + 8),
        stableDrakeViews = pageDrakes.map((org, index) => {
          return (
            <div key={index} className="stable-drake-overlay" style={{width: 116, height: 116}}>
              <FVEggHatchView organism = {org} id={this.props.idPrefix + index} onClick={handleClick} eggStyle={{left: -477, top: -424}} displayStyle={displayStyle}/>
            </div>
          );
        });
    const classes = classNames('geniblocks clutch-view', this.props.className);
    const maxPages = this.props.orgs.length / 8;

    return (
      <div className={classes}>
        <div className="drake-pages">
          <div className="clutch-drakes">
            { stableDrakeViews }
          </div>
        </div>
        <div className="clutch-page-counter clutch-counter">
          <div className="clutch-slider left" onClick={this.handlePageBackward}></div>
          <div className="clutch-page-text">Clutch:</div>
          <div className="clutch-page-count">{this.state.page + " / " + maxPages}</div>
          <div className="clutch-slider right" onClick={this.handlePageForward}></div>
        </div>
      </div>
    );
  }
});

export default ClutchView;
