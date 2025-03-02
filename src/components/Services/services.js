import React, { Component } from "react";
import { Container, Row } from "reactstrap";

//Import Section Title
import SectionTitle from "../common/section-title";

//Import Service Box
import ServiceBox from "./service-box";

class Services extends Component {
  state = {
    services: [
      {
        title: "Digital Design",
        icon: "pe-7s-diamond",
        description:
          "Some quick example text to build on the card title and make up the bulk of the card's content. Moltin gives platform.",
      },
      {
        title: "Unlimited Colors",
        icon: "pe-7s-display2",
        description:
          "Credibly brand standards compliant users without extensible services. Anibh euismod tincidunt laoreet Ipsum passage.",
      },
      {
        title: "Strategy Solutions",
        icon: "pe-7s-piggy",
        description:
          "Separated they live in Bookmarksgrove right at the coast of the Semantics, and large language ocean neary regelia.",
      },
      {
        title: "Awesome Support",
        icon: "pe-7s-science",
        description:
          "It is a paradisematic country, in which roasted parts of sentences fly into your mouth leave for the far World.",
      },
      {
        title: "Truly Multipurpose",
        icon: "pe-7s-news-paper",
        description:
          "Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic.",
      },
      {
        title: "Easy to customize",
        icon: "pe-7s-plane",
        description:
          "Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia.",
      },
      {
        title: "Pixel Perfect Design",
        icon: "pe-7s-arc",
        description:
          "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.",
      },
      {
        title: "Perfect Toolbox",
        icon: "pe-7s-tools",
        description:
          "Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur.",
      },
      {
        title: "Awesome Design",
        icon: "pe-7s-timer",
        description:
          "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
      },
    ],
  };
  render() {
    return (
      <React.Fragment>
        <section className="section bg-light" id="services">
          <Container>
            {/* Render section title */}
            <SectionTitle
              title="Our Services"
              description="We craft digital, graphic and dimensional thinking, to create category leading brand experiences that have meaning and add a value for our clients."
            />

            <Row className="mt-5">
              {/* render service box */}
              {this.state.services.map((service, key) => (
                <ServiceBox
                  key={key}
                  title={service.title}
                  icon={service.icon}
                  description={service.description}
                />
              ))}
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default Services;
