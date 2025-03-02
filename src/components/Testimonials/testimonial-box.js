import React, { Component } from "react";
import { Col } from "reactstrap";

class TestimonialBox extends Component {
  render() {
    return (
      <React.Fragment>
        <Col lg="4">
          <div className="testimonial-box mt-4">
            <div className="testimonial-decs p-4">
              <div className="testi-icon">
                <i className="mdi mdi-format-quote-open display-1"></i>
              </div>
              <img
                src={this.props.testimonial.image}
                alt=""
                className="img-fluid mx-auto d-block img-thumbnail rounded-circle mb-4"
              />
              <div className="p-1">
                <h5 className="text-center text-uppercase mb-3">
                  {this.props.testimonial.name} -{" "}
                  <span className="text-muted text-capitalize">
                    {this.props.testimonial.cmpName}
                  </span>
                </h5>
                <p className="text-muted text-center mb-0">
                  {this.props.testimonial.message}
                </p>
              </div>
            </div>
          </div>
        </Col>
      </React.Fragment>
    );
  }
}

export default TestimonialBox;
