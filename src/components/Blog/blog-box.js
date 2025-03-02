import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col } from "reactstrap";

class BlogBox extends Component {
  render() {
    return (
      <React.Fragment>
        <Col lg="4">
          <div className="blog-box mt-4">
            <img
              src={this.props.blog.image}
              className="img-fluid rounded"
              alt=""
            />
            <div>
              <h5 className="mt-4 text-muted">{this.props.blog.topic}</h5>
              <h4 className="mt-3">
                <Link to={this.props.blog.link} className="blog-title">
                  {" "}
                  {this.props.blog.title}{" "}
                </Link>
              </h4>
              <p className="text-muted">{this.props.blog.description}</p>
              <div className="mt-3">
                <Link to={this.props.blog.link} className="read-btn">
                  Read More <i className="mdi mdi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </React.Fragment>
    );
  }
}

export default BlogBox;
