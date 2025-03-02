import React, { Component } from "react";
import { Container, Row } from "reactstrap";

//Import Section Title
import SectionTitle from "../common/section-title";

//Import Blog Box
import BlogBox from "./blog-box";

class Blog extends Component {
  state = {
    blogs: [
      {
        id: 1,
        image: "assets/images/blog/img-1.jpg",
        topic: "UI & UX Design",
        title: "Doing a cross country road trip",
        description:
          "She packed her seven versalia, put her initial into the belt and made herself on the way..",
        link: "",
      },
      {
        id: 2,
        image: "assets/images/blog/img-2.jpg",
        topic: "Digital Marketing",
        title: "New exhibition at our Museum",
        description:
          "Pityful a rethoric question ran over her cheek, then she continued her way.",
        link: "",
      },
      {
        id: 3,
        image: "assets/images/blog/img-3.jpg",
        topic: "Travelling",
        title: "Why are so many people..",
        description:
          "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.",
        link: "",
      },
    ],
  };
  render() {
    return (
      <React.Fragment>
        <section className="section bg-light active" id="blog">
          <Container>
            {/* Render section title */}
            <SectionTitle
              title="Latest News"
              description="Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean class at a euismod mus luctus quam."
            />

            <Row className="mt-4">
              {/* Render blog boxes */}
              {this.state.blogs.map((blog, key) => (
                <BlogBox key={key} blog={blog} />
              ))}
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default Blog;
