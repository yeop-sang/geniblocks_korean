import React, {PropTypes} from 'react';

export default class AuthoringUpload extends React.Component {

  static propTypes = {
    isEnabled: PropTypes.bool.isRequired,
    onCompleteUpload: PropTypes.func.isRequired
  };

  state = {
    showErrorMessage: false,
    uploadComplete: false
  }

  handleFileSelected = (evtReact) => {
    const { onCompleteUpload } = this.props,
          files = evtReact.target.files,
          file = files && files[0],
          reader = new FileReader();

    this.setState({ showErrorMessage: false });

    reader.onload = (evt) => {
      try {
        const authoring = JSON.parse(evt.target.result);

        this.setState({ uploadComplete: true });

        onCompleteUpload(authoring);
      }
      catch(e) {
        this.setState({ showErrorMessage: true });
      }
    };

    // 'file' can be null if dialog canceled
    if (file)
      reader.readAsText(file);

    // clear value so selecting the same file again triggers change event
    this.refs.uploadButton.value = null;
  }

  render() {
    if (!this.props.isEnabled || this.state.uploadComplete) return null;

    const optionalErrorMessage = this.state.showErrorMessage
                                  ? <div id='upload-message-wrapper' className='upload-button-wrapper'>
                                        <span id='upload-message-text' className='upload-button-text'>
                                          Error parsing JSON. Please select a new or changed file.
                                        </span>
                                    </div>
                                  : null;
    return (
      <div id='upload-button-backdrop' className='mission-backdrop'>
        <div id='upload-button-container'>
          <div id='upload-button-wrapper' className='upload-button-wrapper'>
            <label id='upload-button-label'>
              <input id='upload-button' type='file' name='input-name' ref='uploadButton'
                      style={{ display: 'none' }} onChange={this.handleFileSelected} />
              <span id='upload-button-text' className='upload-button-text'>
                Click here to select author configuration JSON file:
              </span>
            </label>
          </div>
          {optionalErrorMessage}
        </div>
      </div>
    );
  }
}

