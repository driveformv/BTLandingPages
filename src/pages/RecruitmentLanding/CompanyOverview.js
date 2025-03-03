import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import RecruitmentSectionTitle from "./RecruitmentSectionTitle";

class CompanyOverview extends Component {
  render() {
    return (
      <React.Fragment>
        <section className="section bg-light" id="company">
          <Container>
            <RecruitmentSectionTitle
              title="About Border Tire"
              description="We're a leading tire company expanding our operations with a new state-of-the-art retread tire plant in Redlands, California."
            />
            <Row className="mt-4">
              <Col lg={6}>
                <div className="mt-4">
                  <p className="text-muted">
                    Border Tire has been a trusted name in the tire industry for years, providing quality products and exceptional service to our customers. Our new Redlands plant represents a significant expansion of our operations and will serve as a key hub for our retread tire production.
                  </p>
                  <p className="text-muted">
                    This state-of-the-art facility will utilize the latest technology and processes to deliver high-quality retread tires while maintaining our commitment to sustainability and environmental responsibility.
                  </p>
                  <p className="text-muted">
                    We're looking for talented individuals who share our values of quality, integrity, and customer service to join our team and help us grow our operations in Redlands.
                  </p>
                </div>
              </Col>
              <Col lg={6}>
                <div className="mt-4">
                  <img
                    src="/assets/images/border-tire-employee.jpg"
                    alt="Border Tire employee working on a tire"
                    className="img-fluid rounded"
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default CompanyOverview;
