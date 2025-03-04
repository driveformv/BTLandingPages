import React, { Component } from "react";
import { Container, Row, Col, Button } from "reactstrap";

class CallToAction extends Component {
  render() {
    return (
      <React.Fragment>
        <section className="section bg-light" id="call-to-action">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} className="text-center">
                <h3 className="mb-4">Join us at Border Tire MRT and let's roll into a bright future together!</h3>
                <p className="text-muted mb-4">
                  We can't wait to welcome you to the Border Tire family. Questions? Contact our recruitment team.
                </p>
                <Button
                  color="orange"
                  href="tel:1-844-717-TIRE"
                  className="btn-lg text-white"
                >
                  Call a Recruiter Now
                </Button>
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default CallToAction;
