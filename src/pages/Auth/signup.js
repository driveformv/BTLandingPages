import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Home Button
import AccountHomeButton from "./account-home-button";

const SignUp = () => {

  const toggleThem = () => {
    if (document.body.getAttribute("data-bs-theme") === "light") {
      document.body.setAttribute("data-bs-theme", "dark");
    } else {
      document.body.setAttribute("data-bs-theme", "light");
    }
  };


  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstname: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
        firstname: Yup.string().required("Please Enter Your Firstname"),
        email: Yup.string().required("Please Enter Your Email"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .max(8, "Password must be at most 8 characters")
            .required("Please Enter Your Password")
    }),
    onSubmit: (values) => {
        console.log("values",values);
    }
});

  useEffect(() => {
    document.body.classList.add("bg-account-pages");
    document.body.classList.add("py-4");
    document.body.classList.add("py-sm-0");
    document.getElementById("colorTheme").setAttribute("href","assets/colors/red.css")


    // Define the cleanup function to remove the added classes
    return () => {
      document.body.classList.remove("bg-account-pages");
      document.body.classList.remove("py-4");
      document.body.classList.remove("py-sm-0");
      document.getElementById("colorTheme").setAttribute("href","assets/colors/cyan.css")

    };
  }, []);
    return (
      <React.Fragment>
        {/* render home button */}
        <AccountHomeButton />

        <Link to="#" id="mode" class="mode-btn text-white" onClick={() => toggleThem()}>
        <i class="mdi mdi-weather-sunny bx-spin mode-light"></i>
        <i class="mdi mdi-moon-waning-crescent mode-dark"></i>
      </Link>

        <section className="vh-100">
          <div className="display-table">
            <div className="display-table-cell">
              <Container>
                <Row className="justify-content-center">
                  <Col lg="5">
                    <Card className="account-card">
                      <CardBody>
                        <div className="text-center mt-3">
                          <h3 className="font-weight-bold">
                            <Link
                              to="/"
                              className="text-dark text-uppercase account-pages-logo"
                            >
                              <i className="mdi mdi-alien"></i>Hiric
                            </Link>
                          </h3>
                          <p className="text-muted">
                            Sign up for a new Account
                          </p>
                        </div>
                        <div className="p-4">
                          <Form
                            onSubmit={(e) => {
                              e.preventDefault();
                              validation.handleSubmit();
                              return false;
                          }}
                          >
                            <div className="form-group">
                              <Label for="firstname">First Name</Label>
                              <Input
                                name="firstname"
                                className="form-control mb-2"
                                placeholder="First Name"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.firstname || ""}
                                invalid={
                                    validation.touched.firstname && validation.errors.firstname ? true : false
                                }
                            />
                            {validation.touched.firstname && validation.errors.firstname ? (
                                <FormFeedback type="invalid">{validation.errors.firstname}</FormFeedback>
                            ) : null}
                            </div>

                            <div className="form-group mt-3">
                              <Label for="email">Email</Label>
                              <Input
                                name="email"
                                className="form-control mb-2"
                                placeholder="Enter Email"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email || ""}
                                invalid={
                                    validation.touched.email && validation.errors.email ? true : false
                                }
                            />
                            {validation.touched.email && validation.errors.email ? (
                                <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                            ) : null}
                            </div>

                            <div className="form-group mt-3">
                              <Label for="userpassword">Password</Label>
                              <Input
                                name="password"
                                className="form-control mb-2"
                                placeholder="Enter password"
                                type="password"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.password || ""}
                                invalid={
                                    validation.touched.password && validation.errors.password ? true : false
                                }
                            />
                            {validation.touched.password && validation.errors.password ? (
                                <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                            ) : null}
                            </div>

                            <div className="custom-control custom-checkbox mt-3">
                              <Input
                                type="checkbox"
                                className="custom-control-input"
                                id="customControlInline"
                              />{" "}
                              <Label
                                className="custom-control-label"
                                for="customControlInline"
                              >{" "}
                                Remember me
                              </Label>
                            </div>

                            <div className="d-grid mt-3">
                              <Button
                                type="submit"
                                className="btn btn-primary"
                              >
                                Sign in
                              </Button>
                            </div>

                            <div className="mt-4 mb-0 text-center">
                              <p className="mb-0">
                                Don't have an account ?{" "}
                                <Link to="/login" className="text-danger">
                                  Sign in
                                </Link>
                              </p>
                            </div>
                          </Form>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }

export default SignUp;
