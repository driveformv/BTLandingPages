import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import RecruitmentSectionTitle from "./RecruitmentSectionTitle";

class RetreadTechnicianRole extends Component {
  scrollToApplication = () => {
    const target = document.getElementById("application-form-container") || document.getElementById("application") || document.getElementById("hero-application");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      const jobSelect = document.getElementById("preferredRole");
      if (jobSelect) {
        jobSelect.value = "retread-technician";
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <section className="section" id="retread-role">
          <Container>
            <RecruitmentSectionTitle
              title="About the Retread Technician Role"
              description="As a Retread Technician, you'll learn to give worn tires a second life using Michelin's cutting-edge retread process."
            />

            <Row className="mt-4">
              <Col lg={12} className="mb-4">
                <Card className="border-0 shadow rounded">
                  <CardBody>
                    <h4>What You'll Do as a Retread Technician</h4>
                    <p className="text-muted">Using Michelin's cutting-edge retread process, you will:</p>
                    <ul className="text-muted">
                      <li>Inspect tires for damage or wear, ensuring they're fit for retreading</li>
                      <li>Buff and prepare tires, removing old treads</li>
                      <li>Apply new tread rubber to the tire with specialized equipment</li>
                      <li>Cure and finish the tire, making it look and perform like new</li>
                      <li>Quality-check everything – we take pride in doing it right the first time</li>
                    </ul>
                    <p className="text-muted">Don't worry if you've never done this before – we will train you every step of the way. You'll work with advanced machinery and learn skills that can last a lifetime.</p>
                    
                    <h4 className="mt-4">Who Should Apply?</h4>
                    <p className="text-muted">We're looking for motivated, reliable individuals who are ready to grow. If you:</p>
                    <ul className="text-muted">
                      <li>Have a strong work ethic and positive attitude</li>
                      <li>Enjoy working with your hands and as part of a team</li>
                      <li>Are willing to learn and follow our proven processes</li>
                      <li>Value safety and take pride in a job well done</li>
                    </ul>
                    <p className="text-muted">...then you're a perfect fit! Whether you're just starting your career, switching industries, or looking for a fresh start, Border Tire Retread Plant MRT welcomes you.</p>
                    
<div className="text-center mt-4">
  <Button 
    color="orange" 
    onClick={this.scrollToApplication}
    className="mt-2 btn-lg"
  >
    Apply Now
  </Button>
</div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default RetreadTechnicianRole;
