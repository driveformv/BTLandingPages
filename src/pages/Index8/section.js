import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

class Section extends Component {
  render() {
    return (
      <React.Fragment>
        <section
          className="section section-lg home-half"
          id="home"
          style={{
            backgroundImage: `url(assets/images/img-2.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-overlay"></div>
          <Container>
            <Row>
              <Col
                lg={{ size: 8, offset: 2 }}
                className="text-white text-center"
              >
                <h4 className="home-small-title">Awesome Design</h4>
                <h1 className="home-title">
                  We love make things amazing and simple
                </h1>
                <p className="pt-3 home-desc mx-auto">
                  Maecenas class semper class semper sollicitudin lectus lorem
                  iaculis imperdiet aliquam vehicula tempor auctor curabitur
                  pede aenean ornare.
                </p>
                <div className="mt-5">
                  <iframe
                    title="test"
                    src="http://player.vimeo.com/video/69988283?color=f15b72&amp;title=0&amp;byline=0&amp;portrait=0"
                    width="555"
                    height="321"
                    className="frame-border"
                  ></iframe>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default Section;
