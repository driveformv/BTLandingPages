import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

//Import Particles
// import Particles from "react-particles-js";

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
    //particales
    const particlesInit = async (main) => {
      console.log(main);
      await loadFull(main);
    };
  
    const particlesLoaded = (container) => {
      console.log(container);
    };
  
    return (
      <React.Fragment>
        <section className="section bg-home vh-100 active" id="home">
          <div   className="bg-overlay">
              <Particles
             
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={{
                  style:{
                    position:"absolute"
                  },
                  fpsLimit: 120,
                  interactivity: {
                    events: {
                      onClick: {
                        enable: true,
                        mode: "push",
                      },
                      onHover: {
                        enable: true,
                        mode: "repulse",
                      },
                      resize: true,
                    },
                    modes: {
                      push: {
                        quantity: 4,
                      },
                      repulse: {
                        distance: 100,
                        duration: 9,
                      },
                    },
                  },
                  particles: {
                    color: {
                      value: "#ffffff",
                    },
                    links: {
                      color: "#ffffff",
                      distance: 150,
                      enable: true,
                      opacity: 0.3,
                      width: 2,
                    },
                    collisions: {
                      enable: true,
                    },
                    move: {
                      direction: "none",
                      enable: true,
                      outModes: {
                        default: "bounce",
                      },
                      random: false,
                      speed: 2,
                      straight: false,
                    },
                    number: {
                      density: {
                        enable: true,
                        area: 900,
                      },
                      value: 100,
                    },
                    opacity: {
                      value: 0.4,
                    },
                    shape: {
                      type: "circle",
                    },
                    size: {
                      value: { min: 1, max: 5 },
                    },
                  },
                  detectRetina: true,
                }}
              />
            </div>
         
              <Container className="slidero z-3" >
                <Row className="justify-content-center">
                  <Col
                    lg={{ size: 8 }}
                    className="text-white text-center"
                  >
                    <h4 className="home-small-title">Awesome Design</h4>
                    <h1 className="home-title">
                      We love make things amazing and simple
                    </h1>
                    <p className="pt-3 home-desc mx-auto">
                      Maecenas class semper class semper sollicitudin lectus
                      lorem iaculis imperdiet aliquam vehicula tempor auctor
                      curabitur pede aenean ornare.
                    </p>
                    <p
                      className="play-shadow mt-4"
                      data-bs-toggle="modal"
                      data-bs-target="#watchvideomodal"
                    >
                      <Link
                        onClick={this.callModal}
                        to="#"
                        className="play-btn video-play-icon"
                      >
                        <i className="mdi mdi-play text-center"></i>
                      </Link>
                    </p>
                  </Col>
                </Row>
              </Container>
              {/* Render ModalSection Component for Modal */}
              <ModalSection ref="child" channel="vimeo" videoId="99025203" />
         
         
        </section>
      </React.Fragment>
    );
  }
}

export default Section;
