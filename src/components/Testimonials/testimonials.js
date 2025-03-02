import React, { Component } from "react";
import { Container, Row } from "reactstrap";

//Import Section Title
import SectionTitle from "../common/section-title";

//Import Testimonial Box
import TestimonialBox from "./testimonial-box";

class Testimonials extends Component {
  state = {
    testimonials: [
      {
        id: 1,
        image: "assets/images/testimonials/user-1.jpg",
        name: "DENNIS WILLIAMS",
        cmpName: "Charleston",
        message:
          "“I feel confident imposing change on myself. It's a lot more fun progressing than looking back. That's why I ultricies enim at malesuada nibh diam on tortor neaded to throw curve balls.”",
      },
      {
        id: 2,
        image: "assets/images/testimonials/user-2.jpg",
        name: "LAURIE BELL",
        cmpName: "Worcester",
        message:
          "“Our task must be to free ourselves by widening our circle of compassion to embrace all living creatures and the whole of quis consectetur nunc sit amet semper justo. nature and its beauty.”",
      },
      {
        id: 3,
        image: "assets/images/testimonials/user-3.jpg",
        name: "HOWARD KELLEY",
        cmpName: "Lynchburg",
        message:
          "“I've learned that people will forget what you said, people will forget what you did, but people will never forget how donec in efficitur lectus, nec lobortis metus you made them feel.”",
      },
    ],
  };
  render() {
    return (
      <React.Fragment>
        <section className="section" id="testi">
          <Container>
            {/* Render section title */}
            <SectionTitle
              title="What they've said"
              description="The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli."
            />

            <Row className="mt-5">
              {/* render testimonials box */}
              {this.state.testimonials.map((testimonial, key) => (
                <TestimonialBox key={key} testimonial={testimonial} />
              ))}
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default Testimonials;
