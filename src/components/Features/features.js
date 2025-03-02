import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

class Features extends Component {
  render() {
    return (
      <React.Fragment>
        <section className="section" id="features">
          <Container>
            <Row className="align-items-center">
              <Col lg="5" className="order-2 order-lg-1">
                <div className="features-box mt-5 mt-lg-0">
                  <h3>
                    A digital web design studio creating modern & engaging
                    online
                  </h3>
                  <p className="text-muted web-desc">
                    Separated they live in Bookmarksgrove right at the coast of
                    the Semantics, a large language ocean.
                  </p>
                  <ul className="text-muted list-unstyled mt-4 features-item-list">
                    <li className="">We put a lot of effort in design.</li>
                    <li className="">
                      The most important ingredient of successful website.
                    </li>
                    <li className="">Submit Your Orgnization.</li>
                  </ul>
                  <Link
                    to="#"
                    className="btn btn-primary mt-4 waves-effect waves-light"
                  >
                    Learn More <i className="mdi mdi-arrow-right"></i>
                  </Link>
                </div>
              </Col>
              <Col lg={{ size: 7, order: 2 }} xs={{ order: 1 }}>
                <div className="features-img mx-auto me-lg-0">
                  <img
                    src="assets/images/growth-analytics.svg"
                    alt="macbook"
                    className="img-fluid"
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

export default Features;
