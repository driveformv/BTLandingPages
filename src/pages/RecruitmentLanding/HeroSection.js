import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";

class HeroSection extends Component {
  render() {
    return (
      <React.Fragment>
        <section className="section bg-home home-half" id="home" data-image-src="images/bg-home.jpg"> 
          <div className="bg-overlay" style={{ background: "linear-gradient(to right, #f09105, #dc8505)", opacity: 0.95 }}></div>
          <Container>
            <Row>
              <Col
                lg={{ size: 8, offset: 2 }}
                className="text-white text-center"
              >
                <h1 className="home-title">
                  Join Our Team in Redlands!
                </h1>
                <p className="pt-3 home-desc mx-auto">
                  Border Tire is expanding with a new retread tire plant in Redlands, CA. 
                  We're looking for talented individuals to join our growing team.
                </p>
                <div className="mt-4">
                  <Link
                    to="#application"
                    className="btn btn-orange mt-2 mr-2"
                    style={{ backgroundColor: "#ffffff", color: "#f09105" }}
                  >
                    Apply Now
                  </Link>
                  <Button
                    tag={Link}
                    to="#jobs"
                    className="btn btn-outline-light mt-2"
                  >
                    View Open Positions
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default HeroSection;
