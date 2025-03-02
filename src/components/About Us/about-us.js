import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

//Import Team Box
import TeamBox from "./team-box";

class AboutUs extends Component {
  state = {
    members: [
      {
        id: 1,
        name: "Frank Johnson",
        image: "assets/images/team/img-1.jpg",
        post: "CEO",
      },
      {
        id: 2,
        name: "Elaine Stclair",
        image: "assets/images/team/img-2.jpg",
        post: "DESIGNER",
      },
      {
        id: 3,
        name: "Wanda Arthur",
        image: "assets/images/team/img-3.jpg",
        post: "DEVELOPER",
      },
      {
        id: 4,
        name: "Joshua Stemple",
        image: "assets/images/team/img-4.jpg",
        post: "MANAGER",
      },
    ],
  };
  render() {
    return (
      <React.Fragment>
        <section className="section" id="about">
          <Container>
            <Row>
              <Col lg={{ size: 8, offset: 2 }}>
                <div className="about-title mx-auto text-center">
                  <h2 className="font-weight-light">
                    A Digital web studio creating stunning &amp; Engaging online
                    Experiences{" "}
                  </h2>
                  <p className="text-muted pt-4">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                    Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                    natoque penatibus et magnis dis parturient montes, nascetur
                    ridiculus mus donec various versions have evolved quam
                    felis.
                  </p>
                </div>
              </Col>
            </Row>
            <Row className="mt-5">
              {/* Render Team members */}
              {this.state.members.map((member, key) => (
                <TeamBox
                  key={key}
                  name={member.name}
                  image={member.image}
                  post={member.post}
                />
              ))}
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default AboutUs;
