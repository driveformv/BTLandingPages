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
import ScrollspyNav from "../../components/Navbar/scrollSpy";

//Import Stickey Header
import StickyHeader from "react-sticky-header";
import "../../../node_modules/react-sticky-header/styles.css";

class RecruitmentNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navItems: [
        { id: 1, idnm: "home", navheading: "Home" },
        { id: 2, idnm: "company", navheading: "About" },
        { id: 3, idnm: "jobs", navheading: "Jobs" },
        { id: 4, idnm: "benefits", navheading: "Benefits" },
        { id: 5, idnm: "application", navheading: "Apply" },
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
                this.props.navClass +
                " navbar navbar-expand-lg fixed-top navbar-custom sticky sticky-dark"
              }
              id="navbar"
            >
              <Container>
                <NavbarBrand className="logo" href="/">
                  <img 
                    src="/assets/images/logo/Border Tire-01.png" 
                    alt="Border Tire Logo" 
                    className="navbar-logo"
                  />
                </NavbarBrand>

                <NavbarToggler
                  className=""
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarCollapse"
                  aria-controls="navbarCollapse"
                  aria-expanded="false"
                  onClick={this.toggle}
                >
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
                          color="orange"
                          className="navbar-btn btn-rounded waves-effect waves-light"
                          onClick={() => {
                            const applicationForm = document.getElementById("application");
                            if (applicationForm) {
                              applicationForm.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                        >
                          Apply Now
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

export default RecruitmentNavbar;
