import React from 'react';
import { shuffle } from 'lodash';

const loadingText = [
  "Warming Up Chromoscope",
  "Hatching Drake Eggs",
  "Mucking Stables",
  "Freshening Breeding Rooms",
  "Digitizing Drake DNA",
  "Pipetting",
  "Scrubbing Drake Scales",
  "Trimming Drake Toenails",
  "Turning on Underground Base Muzak",
  "Warming Cafeteria Food",
  "Polishing Microscopes",
  "Rereading Safety Manuals",
  "Washing Lab Coats",
  "Applying for Grants"
];

let timer;

class LoadingView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      textN: 0,
      strings: ["Loading Images"].concat(shuffle(loadingText))
    };
  }

  componentDidMount() {
    const self = this;
    const {strings} = this.state;
    timer = setInterval(function() {
      const nextText = (self.state.textN + 1) % strings.length;
      self.setState({textN: nextText});
    }, 900);
  }

  componentWillUnmount() {
    clearInterval(timer);
  }

  render() {
    return( <div className="loading-images">{this.state.strings[this.state.textN] + "..."}</div> );
  }

}

export default LoadingView;
