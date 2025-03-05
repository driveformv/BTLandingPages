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
                <h3 className="mb-4">Join us at Border Tire Retread Plant MRT and let's roll into a bright future together!</h3>
                <div className="hiring-event-box p-4 mb-4">
                  <h4 className="text-primary mb-3">Upcoming Hiring Event</h4>
                  <p className="mb-2"><strong>When:</strong> Wednesday, April 2nd & Thursday, April 3rd, 5–8 PM</p>
                  <p className="mb-2"><strong>Where:</strong> 1897 E Colton Ave., Redlands, CA</p>
                  <p className="mb-0">Stop by to learn more about our opportunities and meet our team!</p>
                </div>
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
