import React, { Component } from "react";
import { Container, Row, Col, Card } from "reactstrap";
import ApplicationForm from "./ApplicationForm";

// Custom form component for the hero section
class HeroApplicationForm extends Component {
  render() {
    return (
      <div className="hero-application-form" id="hero-application">
        <Card className="shadow-lg border-0 rounded-lg p-3">
          <ApplicationForm inHeroSection={true} />
        </Card>
      </div>
    );
  }
}

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
        <section className="section bg-home home-half" id="home">
          <div className="bg-overlay" style={{ background: "linear-gradient(to right, #f37423, #e06316)", opacity: 0.95 }}></div>
          <Container fluid className="py-0">
            <Row className="justify-content-center align-items-center">
              {/* Left Column - Hero Text */}
              <Col lg={6} md={12} className="text-white text-center text-lg-start px-3 px-lg-4 mb-2 mb-lg-0">
                <h1 className="home-title" style={{ fontSize: "calc(1.5rem + 1vw)", lineHeight: "1.2" }}>
                  Join the Border Tire Family – Drive Your Career Forward 🚀
                </h1>
                <p className="pt-1 home-desc mb-2" style={{ fontSize: "0.95rem" }}>
                  Welcome to Border Tire Retread Plant MRT (Michelin Retread Technologies) – where we retread tires and build futures. 
                  We're hiring at least 30 retread technicians. No experience? No problem!
                </p>
                {/* Apply button removed as requested since form is already in hero section */}
              </Col>
              
              {/* Right Column - Application Form */}
              <Col lg={6} md={12} className="px-3 px-lg-4">
                <HeroApplicationForm />
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default HeroSection;
