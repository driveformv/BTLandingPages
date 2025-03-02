import React, { Component } from "react";
import { Container, Row, Col, Form, Button } from "reactstrap";

class Section extends Component {
  render() {
    return (
      <React.Fragment>
        <section className="section bg-home home-half" id="home">
          <div className="bg-overlay"></div>
          <Container>
            <Row>
              <Col
                lg={{ size: 8, offset: 2 }}
                className="text-white text-center"
              >
                <h4 className="home-small-title">Awesome Design</h4>
                <h1 className="home-title">
                  We love make things amazing and simple
                </h1>
                <p className="pt-3 home-desc mx-auto">
                  Maecenas class semper class semper sollicitudin lectus lorem
                  iaculis imperdiet aliquam vehicula tempor auctor curabitur
                  pede aenean ornare.
                </p>
                <div className="text-center subscribe-form mt-5">
                  <Form action="#">
                    <input type="text" placeholder="Email" />
                    <Button type="submit" className="btn btn-primary">
                      Subscribe
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default Section;
