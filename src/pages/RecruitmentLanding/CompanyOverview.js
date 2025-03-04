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
              title="Who We Are"
              description="Border Tire MRT is a leader in tire retread services, proudly using Michelin's state-of-the-art Retread Technologies."
            />
            <Row className="mt-4">
              <Col lg={6}>
                <div className="mt-4">
                  <p className="text-muted">
                    At Border Tire MRT, we give new life to tires using Michelin's state-of-the-art Retread Technologies. We keep trucks and heavy equipment rolling safely while promoting sustainability by recycling tires.
                  </p>
                  <p className="text-muted">
                    Our team is like a family – we work hard, we laugh often, and we take pride in doing the job right. When you join Border Tire, you become part of a company that values quality, safety, and people.
                  </p>
                  <p className="text-muted">
                    We're looking for motivated, reliable individuals who are ready to grow with us. Whether you're just starting your career, switching industries, or looking for a fresh start, Border Tire MRT welcomes you.
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
