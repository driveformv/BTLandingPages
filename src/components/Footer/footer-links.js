import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

class FooterLinks extends Component {
  state = {
    socials: [
      { icon: "mdi mdi-facebook", link: "#" },
      { icon: "mdi mdi-twitter", link: "#" },
      { icon: "mdi mdi-linkedin", link: "#" },
      { icon: "mdi mdi-google-plus", link: "#" },
      { icon: "mdi mdi-microsoft-xbox", link: "#" },
    ],
  };
  render() {
    return (
      <React.Fragment>
        <div className="footer-alt">
          <Container>
            <Row>
              <Col lg="12">
                <div className="float-sm-start pull-none">
                  <p className="copy-rights  mb-3 mb-sm-0">
                    2023 © Hiric - Themesbrand
                  </p>
                </div>
                <div className="float-sm-end pull-none copyright ">
                  <ul className="list-inline d-flex flex-wrap social m-0">
                    {this.state.socials.map((social, key) => (
                      <li className="list-inline-item" key={key}>
                        <Link to={social.link} className="social-icon">
                          <i className={social.icon}></i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* <div className="clearfix"></div> */}
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default FooterLinks;
