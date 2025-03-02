import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

class Section extends Component {
  render() {
    return (
      <React.Fragment>
        <section
          className="home-padding-t-150 position-relative"
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
                <Link to="#" className="btn btn-primary mt-4">
                  Get Started
                </Link>
                <img
                  src="assets/images/home-dashboard.png"
                  alt=""
                  className="img-fluid mt-4"
                />
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default Section;
