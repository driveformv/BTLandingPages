import React, { Component } from "react";
import { Container, Row, Col, Button } from "reactstrap";

class HeroSection extends Component {
  scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

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
                  Join the Border Tire Family – Drive Your Career Forward 🚀
                </h1>
                <p className="pt-3 home-desc mx-auto">
                  Welcome to Border Tire MRT (Michelin Retread Technologies) – where we retread tires and build futures. 
                  We're hiring at least 30 retread technicians. No experience? No problem!
                </p>
                <div className="mt-4">
                  <Button
                    onClick={() => this.scrollToSection("application")}
                    className="btn btn-orange mt-2 mr-2"
                    style={{ backgroundColor: "#ffffff", color: "#f09105" }}
                  >
                    Apply Now
                  </Button>
                  <Button
                    onClick={() => this.scrollToSection("jobs")}
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
