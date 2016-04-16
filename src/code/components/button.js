/*
 * This component is a very thin wrapper around a standard button designed to prevent
 * extraneous focus highlighting added by browsers when clicking on a button while
 * maintaining keyboard accessibility. See 
 * https://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/
 * for details. The upshot is that we use mouse events on the button to disable the
 * focus highlight -- mousing/clicking on a push button should not be used as an
 * incidator that the user would like to keyboard-interact with that button, which
 * is what focusing a clicked button implies.
 * IMPORTANT: To maintain accessibility, there must be code somewhere to reenable
 * the focus highlight when appropriate. This can be done for 'keydown' by calling
 * Button.enableButtonFocusHighlightOnKeyDown() during application/page initialization,
 * or by adding your own event handler that calls Button.enableButtonFocusHighlight().
 */
import {PropTypes} from 'react';

class Button extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired
  }

  // Installs a keydown handler on the document which will enable button focus highlighting.
  // Should be called once during application initialization.
  static enableButtonFocusHighlightOnKeyDown() {
    document.addEventListener('keydown', () => Button.enableButtonFocusHighlight());
  }

  // Enables button focus highlighting; designed to be called from the keydown handler above
  // but available separately for implementations that require it.
  static enableButtonFocusHighlight() {
    const buttons = document.querySelectorAll('.gb-button');
    // cf. http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
    buttons.forEach(function(button) {
      if (button && button.className)
        button.className = button.className.replace(/(?:^|\s)no-focus-highlight(?!\S)/g , '');
    });
  }

  // prevent extraneous focus highlight on click while maintaining keyboard accessibility
  // see https://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/
  suppressButtonFocusHighlight = (evt) => {
    const noFocusHighlight = 'no-focus-highlight';
    if (evt.target.className.indexOf(noFocusHighlight) < 0)
      evt.target.className += ' ' + noFocusHighlight;
  }

  render() {
    const { className, label, ...others } = this.props,
          classes = className + ' gb-button';

    return (
      <button className={classes} {...others}
              onMouseEnter={this.suppressButtonFocusHighlight}
              onMouseDown={this.suppressButtonFocusHighlight}>
        {label}
      </button>
    );
  }
}

export default Button;
