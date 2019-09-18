import React, { Component } from "react";
import { uploadImage, getData } from "../actions/itemActions";
import Spinner from "../helpers/Spinner";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class MainComponent extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      percent: 0,
      showProgress: null,
      image: null
    };
  }

  componentDidMount() {
    this.props.getData();
  }

  //create ref
  fileInputRef = React.createRef();

  onFormSubmit = e => {
    e.preventDefault(); // Stop form submit

    //validating the file
    //check if the file is exists
    if (this.state.file === null) {
      alert("No image is selected!");
      return;
    }

    //check if the image size is larger than 1MB
    if (this.state.file.size > 1048576) {
      alert("Image size must be less than 1MB!");
      return;
    }

    //check if the dimension of the image is 2048 x 2048 px
    if (this.state.file.width > 2048 || this.state.file.height > 2048) {
      alert("Image dimensions must be 2048 x 2048 px");
      return;
    }

    //check if the file is an image
    if (
      this.state.file.type === "image/jpeg" ||
      this.state.file.type === "image/png" ||
      this.state.file.type === "image/jpg"
    ) {
      this.props.uploadImage(this.state.file);
    } else {
      alert("Please provide a valid image. (JPG, JPEG or PNG)");
    }
  };

  //handle file change
  fileChange = event => {
    event.preventDefault();

    this.setState({ file: event.target.files[0] });

    let imageFile = event.target.files[0];

    if (imageFile) {
      const localImageUrl = URL.createObjectURL(imageFile);
      const imageObject = new window.Image();
      imageObject.onload = () => {
        imageFile.width = imageObject.naturalWidth;
        imageFile.height = imageObject.naturalHeight;
        URL.revokeObjectURL(imageFile);
      };
      imageObject.src = localImageUrl;
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.showProgress !== prevState.showProgress) {
      return { showProgress: nextProps.showProgress };
    }
    if (nextProps.image !== prevState.image) {
      return { image: nextProps.image };
    }
    if (nextProps.percent !== prevState.percent) {
      return { percent: nextProps.percent };
    }

    if (nextProps.error !== prevState.error) {
      return { error: nextProps.error };
    } else {
      return null;
    }
  }

  render() {
    const { image, percent, showProgress } = this.state;
    if (image) {
      return (
        <div
          className="jumbotron jumbotron-fluid mt-5 pt-4"
          style={{
            backgroundColor: "#3b3a30",
            textShadow: "0 1px 3px rgba(0,0,0,.5)",
            color: "white"
          }}
        >
          <div className="container">
            <div className="container">
              <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-2"></div>
                      <div className="col-md-8 mb-2">
                        {image === "empty" ? (
                          <img
                            className="card-img-top"
                            src="https://react.semantic-ui.com/images/wireframe/image.png"
                            alt=""
                            style={{ width: 250, height: 250 }}
                          />
                        ) : (
                          <img
                            className="card-img-top"
                            src={image}
                            style={{ width: 250, height: 250 }}
                            alt=""
                          />
                        )}
                      </div>
                      <div className="col-md-2"></div>
                    </div>
                  </div>
                  <div
                    className="card"
                    style={{
                      width: "25rem",
                      backgroundColor: "#e9ecef",
                      color: "black"
                    }}
                  >
                    <div className="card-body">
                      <h5 className="card-title">Upload image</h5>
                      <p className="card-text">
                        Select the image and click upload.
                      </p>
                      <form>
                        <div className="container">
                          <div className="row">
                            <div className="col-md-1"></div>
                            <div className="col-md-5">
                              <button
                                className="btn btn-outline-secondary btn-block"
                                type="button"
                                onClick={() =>
                                  this.fileInputRef.current.click()
                                }
                              >
                                Select Image
                              </button>
                            </div>
                            <div className="col-md-5">
                              <button
                                className="btn btn-outline-secondary btn-block"
                                type="button"
                                onClick={this.onFormSubmit}
                              >
                                Upload
                              </button>
                            </div>
                            <div className="col-md-1">
                              <input
                                type="file"
                                ref={this.fileInputRef}
                                onChange={event => this.fileChange(event)}
                                hidden
                              />
                            </div>
                          </div>
                          {showProgress ? (
                            <div className="row mt-3">
                              <div className="col-md-12">
                                <div className="progress">
                                  <div
                                    className="progress-bar bg-success"
                                    style={{ width: `${percent}%` }}
                                    role="progressbar"
                                    aria-valuenow={percent}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-md-4"></div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

const mapStateToProps = ({ item }) => ({
  error: item.error,
  percent: item.percent,
  showProgress: item.showProgress,
  image: item.image
});

const mapDispatchToProps = {
  uploadImage,
  getData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MainComponent));
