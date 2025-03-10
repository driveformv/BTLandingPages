import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import RecruitmentSectionTitle from "./RecruitmentSectionTitle";

class EmployeeBenefits extends Component {
  render() {
    return (
      <React.Fragment>
        <section className="section bg-light" id="benefits">
          <Container>
            <RecruitmentSectionTitle
              title="Why Work at Border Tire Retread Plant MRT?"
              description="Join a company that values quality, safety, and people. We offer more than just a job - we offer a career with growth opportunities."
            />

            <Row className="mt-4">
              <Col lg={6}>
                <div className="mt-4">
                  <h4 className="mb-4">Employee Benefits</h4>
                  <Row>
                    <Col md={6}>
                      <div className="d-flex mb-3">
                        <div className="icons-md rounded-circle bg-orange text-white mr-4">
                          <i className="mdi mdi-school"></i>
                        </div>
                        <div>
                          <h5>Comprehensive Training</h5>
                          <p className="text-muted mb-0">Our Michelin-certified training program teaches you everything you need to know – no prior tire experience needed.</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex mb-3">
                        <div className="icons-md rounded-circle bg-orange text-white mr-4">
                          <i className="mdi mdi-cash-multiple"></i>
                        </div>
                        <div>
                          <h5>Competitive Pay & Benefits</h5>
                          <p className="text-muted mb-0">Health insurance, paid time off, and retirement plans to build a secure future.</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex mb-3">
                        <div className="icons-md rounded-circle bg-orange text-white mr-4">
                          <i className="mdi mdi-chart-line"></i>
                        </div>
                        <div>
                          <h5>Career Growth</h5>
                          <p className="text-muted mb-0">Many of our supervisors and managers were once entry-level technicians. We love to promote from within.</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex mb-3">
                        <div className="icons-md rounded-circle bg-orange text-white mr-4">
                          <i className="mdi mdi-account-group"></i>
                        </div>
                        <div>
                          <h5>Fun, Professional Culture</h5>
                          <p className="text-muted mb-0">Our team is tight-knit and supportive with team BBQs, celebration lunches, and on-the-job camaraderie.</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col lg={6}>
                <div className="mt-4">
                  <h4 className="mb-4">Employee Testimonial</h4>
                  <Card className="border-0 shadow">
                    <CardBody>
                      <div className="testimonial-content">
                        <p className="text-muted mb-0">
                          "I've been with Border Tire for three years and have witnessed continuous growth among our employees. Our company focuses heavily on culture and a sense of belonging, providing our team with a supportive environment to expand their careers. 2025 will be an exciting year for us, as we just opened our facility in Las Cruces and will be opening our Mentone location later this year. Both sites will provide great opportunities locally!"
                        </p>
                        <div className="d-flex align-items-center mt-5">
                          <img
                            src="/assets/images/testimonials/Derrick_Mays_.png"
                            alt="Derrick Mays"
                            className="rounded-circle avatar-md mr-5"
                            style={{ marginRight: "2rem", width: "80px", height: "80px", objectFit: "cover" }}
                          />
                          <div>
                            <h5 className="mb-0">Derrick Mays</h5>
                            <p className="text-muted mb-0">Human Resources Manager</p>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default EmployeeBenefits;
