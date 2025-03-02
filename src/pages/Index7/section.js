import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

//Import Text-Rotator
import ReactTextRotator from "react-text-rotator";

//Importing Modal
import ModalSection from "../../components/common/ModalSection";

class Section extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
    };
    this.callModal.bind(this);
  }

  callModal = () => {
    this.refs.child.openModal();
  };

  render() {
    const content = [
      {
        text: "We love make things amazing and simple,",
        animation: "fade",
      },
      {
        text: "We help startups launch their products,",
        animation: "fade",
      },
      {
        text: "Perfect solution for small businesses.",
        animation: "fade",
      },
    ];

    return (
      <React.Fragment>
        <section
          className="section section-lg vh-100"
          id="home"
          style={{
            backgroundImage: `url(assets/images/img-1.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-overlay"></div>
          <div className="display-table">
            <div className="display-table-cell">
              <Container>
                <Row>
                  <Col
                    lg={{ size: 8, offset: 2 }}
                    className="text-white text-center"
                  >
                    <h4 className="home-small-title">Awesome Design</h4>
                    <h1 className="home-title text-rotate">
                      <ReactTextRotator
                        content={content}
                        time={5000}
                        startDelay={2000}
                      />
                    </h1>
                    <p className="pt-3 home-desc mx-auto">
                      Maecenas class semper class semper sollicitudin lectus
                      lorem iaculis imperdiet aliquam vehicula tempor auctor
                      curabitur pede aenean ornare.
                    </p>
                    <p className="play-shadow mt-4">
                      <Link
                        onClick={this.callModal}
                        to="#"
                        className="play-btn video-play-icon"
                      >
                        <i className="mdi mdi-play text-center"></i>
                      </Link>
                    </p>
                  </Col>
                  {/* Render ModalSection Component for Modal */}
                  <ModalSection
                    ref="child"
                    channel="vimeo"
                    videoId="99025203"
                  />
                </Row>
              </Container>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default Section;
