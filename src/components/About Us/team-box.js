import React, { Component } from "react";
import { Col } from "reactstrap";

class TeamBox extends Component {
  render() {
    return (
      <React.Fragment>
        <Col lg="3" sm="6">
          <div className="team-box text-center">
            <div className="team-wrapper">
              <div className="team-member">
                <img
                  alt=""
                  src={this.props.image}
                  className="img-fluid rounded"
                />
              </div>
            </div>
            <h4 className="team-name">{this.props.name}</h4>
            <p className="text-uppercase team-designation">{this.props.post}</p>
          </div>
        </Col>
      </React.Fragment>
    );
  }
}

export default TeamBox;
