import React from 'react';

import defaultImage from '../../assets/img/default-avatar.png';

class PictureUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      imagePreviewUrl: this.props.image || defaultImage
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillReceiveProps(next) {
    if (next.image != this.props.image) { this.setState({ imagePreviewUrl: next.image }); }
  }
  handleImageChange(e) {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file,
        imagePreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
    this.props.receiveUrl(file);
  }
  handleSubmit(e) {
    e.preventDefault();
    // this.state.file is the file/image uploaded
    // in this function you can save the image (this.state.file) on form submit
    // you have to call it yourself
  }
  render() {
    return (
      <div className="picture-container">
        <h6 className="description">Choose Your Logo</h6>
        <div className={`picture ${this.props.receiveStyle}`}>
          <img
            src={this.state.imagePreviewUrl}
            className="picture-src"
            alt="..." />
          <input type="file" onChange={(e) => { return this.handleImageChange(e); }} />
        </div>        
      </div>
    );
  }
}

export default PictureUpload;
