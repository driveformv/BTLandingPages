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
              title="Why Join Border Tire?"
              description="We offer competitive compensation and a comprehensive benefits package to support our team members."
            />

            <Row className="mt-4">
              <Col lg={6}>
                <div className="mt-4">
                  <h4 className="mb-4">Employee Benefits</h4>
                  <Row>
                    <Col md={6}>
                      <div className="d-flex mb-3">
                        <div className="icons-md rounded-circle bg-orange text-white mr-4">
                          <i className="mdi mdi-medical-bag"></i>
                        </div>
                        <div>
                          <h5>Health Insurance</h5>
                          <p className="text-muted mb-0">Comprehensive medical, dental, and vision coverage</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex mb-3">
                        <div className="icons-md rounded-circle bg-orange text-white mr-4">
                          <i className="mdi mdi-cash-multiple"></i>
                        </div>
                        <div>
                          <h5>401(k) Plan</h5>
                          <p className="text-muted mb-0">Retirement savings with company match</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex mb-3">
                        <div className="icons-md rounded-circle bg-orange text-white mr-4">
                          <i className="mdi mdi-beach"></i>
                        </div>
                        <div>
                          <h5>Paid Time Off</h5>
                          <p className="text-muted mb-0">Vacation, holidays, and sick leave</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex mb-3">
                        <div className="icons-md rounded-circle bg-orange text-white mr-4">
                          <i className="mdi mdi-school"></i>
                        </div>
                        <div>
                          <h5>Training & Development</h5>
                          <p className="text-muted mb-0">Opportunities for growth and advancement</p>
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
