import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

class RecruitmentFooter extends Component {
  render() {
    return (
      <React.Fragment>
        <footer className="footer-alt bg-dark">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center">
                  <p className="text-white-50 mb-0">
                    2025 © Border Tire. All Rights Reserved.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </React.Fragment>
    );
  }
}

export default RecruitmentFooter;
