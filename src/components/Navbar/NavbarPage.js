import React, { Component } from "react";
import {
  Nav,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Container,
  Collapse,
  Button,
} from "reactstrap";
import ScrollspyNav from "./scrollSpy";

//Import Stickey Header
import StickyHeader from "react-sticky-header";
import "../../../node_modules/react-sticky-header/styles.css";

class Navbar_Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navItems: [
        { id: 1, idnm: "home", navheading: "Home" },
        { id: 2, idnm: "features", navheading: "Features" },
        { id: 3, idnm: "services", navheading: "Services" },
        { id: 3, idnm: "about", navheading: "About" },
        { id: 4, idnm: "pricing", navheading: "Pricing" },
        { id: 5, idnm: "blog", navheading: "Blog" },
        { id: 6, idnm: "contact", navheading: "Contact" },
      ],
      isOpenMenu: false,
    };
  }

  toggle = () => {
    this.setState({ isOpenMenu: !this.state.isOpenMenu });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = (ev) => {
    ev.preventDefault();
    const navbar = document.getElementById("navbar");
    if (navbar) {
      if (
        document.body.scrollTop >= 50 ||
        document.documentElement.scrollTop >= 50
      ) {
        navbar.classList.add("nav-sticky");
      } else {
        navbar.classList.remove("nav-sticky");
      }
    }
  };

  render() {
    /********************* Menu Js **********************/

    //Store all Navigationbar Id into TargetID variable(Used for Scrollspy)
    let TargetId = this.state.navItems.map((item) => {
      return item.idnm;
    });

    return (
      <React.Fragment>
        <StickyHeader
          header={
            <div
              className={
                this.props.navClass + " navbar navbar-expand-lg fixed-top  navbar-custom sticky sticky-dark"
              }
              id="navbar"
            >
              <Container>
                <NavbarBrand className="logo text-uppercase" href="/">
                  <i className="mdi mdi-alien"></i>Hiric
                </NavbarBrand>

                <NavbarToggler className="" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" onClick={this.toggle}>
                  <i className="mdi mdi-menu"></i>
                </NavbarToggler>

                <Collapse
                  id="navbarCollapse"
                  isOpen={this.state.isOpenMenu}
                  navbar
                >
                  <ScrollspyNav
                    scrollTargetIds={TargetId}
                    activeNavClass="active"
                    scrollDuration="800"
                    headerBackground="true"
                  >
                    <Nav className="navbar-nav navbar-center" id="mySidenav">
                      {this.state.navItems.map((item, key) => (
                        <NavItem
                          key={key}
                          className={item.navheading === "Home" ? "active" : ""}
                        >
                          <NavLink href={"#" + item.idnm}>
                            {" "}
                            {item.navheading}
                          </NavLink>
                        </NavItem>
                      ))}
                    </Nav>
                  </ScrollspyNav>
                  <div className="nav-button ms-auto">
                    <Nav className="navbar-right nav" navbar>
                      <NavItem>
                        <Button
                          type="button"
                          color="primary"
                          className=" navbar-btn btn-rounded waves-effect waves-light"
                        >
                          Try it Free
                        </Button>
                      </NavItem>
                    </Nav>
                  </div>
                </Collapse>
              </Container>
            </div>
          }
          stickyOffset={-100}
        ></StickyHeader>
      </React.Fragment>
    );
  }
}

export default Navbar_Page;
