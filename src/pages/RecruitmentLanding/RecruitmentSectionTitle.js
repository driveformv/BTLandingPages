import React, { Component } from "react";
import { Row, Col } from "reactstrap";

class RecruitmentSectionTitle extends Component {
  render() {
    return (
      <React.Fragment>
        <Row>
          <Col lg={{ size: 8, offset: 2 }}>
            <h1 className="section-title text-center">{this.props.title}</h1>
            <div className="section-title-border orange-section-title-border mt-3"></div>
            <p className="section-subtitle text-muted text-center pt-4 font-secondary">
              {this.props.description}
            </p>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default RecruitmentSectionTitle;
