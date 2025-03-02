import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

class RecruitmentFooter extends Component {
  render() {
    return (
      <React.Fragment>
        <footer className="footer-alt bg-dark">
          <Container>
            <Row>
              <Col lg={6} md={6}>
                <div className="float-start">
                  <p className="text-white-50 mb-0">
                    2025 © Border Tire. All Rights Reserved.
                  </p>
                </div>
              </Col>
              <Col lg={6} md={6}>
                <div className="float-end">
                  <Link to="/login" className="text-white-50">
                    <i className="mdi mdi-lock-outline"></i>
                  </Link>
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
