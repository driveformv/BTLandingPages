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
              title="Why Work at Border Tire MRT?"
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
                          "I've been with Border Tire for over 5 years, and it's been a rewarding experience. The company truly values its employees and provides a supportive work environment. I'm excited about the new Redlands plant and the opportunities it will bring."
                        </p>
                        <div className="d-flex align-items-center mt-4">
                          <img
                            src="/assets/images/testimonials/user-2.jpg"
                            alt="user"
                            className="rounded-circle avatar-md mr-3"
                          />
                          <div>
                            <h5 className="mb-0">Michael Rodriguez</h5>
                            <p className="text-muted mb-0">Production Manager</p>
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
