import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../pages/RecruitmentLanding/RecruitmentStyles.css";
import "./login-styles.css";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Form,
  Input,
  FormFeedback,
  Alert,
  Spinner
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { resetPassword } from "../../authService";

//Import Home Button
import AccountHomeButton from "./account-home-button";

const PasswordForget = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Please enter a valid email")
        .required("Please Enter Your Email"),
    }),
    onSubmit: async (values) => {
      try {
        setError("");
        setSuccess(false);
        setLoading(true);
        await resetPassword(values.email);
        setSuccess(true);
        validation.resetForm();
      } catch (error) {
        console.error("Password reset error:", error);
        setError(
          error.code === "auth/user-not-found"
            ? "No account found with this email address"
            : "Failed to send password reset email. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    document.body.classList.add("bg-account-pages");
    document.body.classList.add("py-4");
    document.body.classList.add("py-sm-0");
    document.getElementById("colorTheme").setAttribute("href","assets/colors/orange.css")
    
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
      {/* <!-- light-dark mode --> */}

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
                        <div className="mb-3">
                          <Link to="/" className="text-dark">
                            <img 
                              src="/assets/images/logo/Border Tire-01.png" 
                              alt="Border Tire Logo" 
                              className="img-fluid" 
                              style={{ height: "50px", width: "auto" }}
                            />
                          </Link>
                        </div>
                        <p className="text-muted">Reset Password</p>
                      </div>
                      <div className="p-4">
                        {error && (
                          <Alert color="danger" className="mb-4">
                            {error}
                          </Alert>
                        )}
                        {success && (
                          <Alert color="success" className="mb-4">
                            Password reset email sent! Check your inbox for instructions.
                          </Alert>
                        )}
                        <div
                          className="alert alert-warning text-center"
                          role="alert"
                        >
                          Enter your email address and we'll send you an email
                          with instructions to reset your password.
                        </div>
                        <Form
                          onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                          }}
                        >
                          <div className="form-group">
                            <Label for="email">Email</Label>
                            <Input
                              name="email"
                              className=""
                              placeholder="Enter Email"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.email || ""}
                              invalid={
                                validation.touched.email &&
                                validation.errors.email
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.email &&
                            validation.errors.email ? (
                              <FormFeedback type="invalid">
                                {validation.errors.email}
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="d-grid mt-3">
                            <Button 
                              type="submit" 
                              color="orange" 
                              className="btn btn-orange"
                              disabled={loading}
                            >
                              {loading ? (
                                <Spinner size="sm" className="me-2" />
                              ) : null}
                              {loading ? "Sending..." : "Reset your Password"}
                            </Button>
                          </div>
                          
                          <div className="mt-4 mb-0 text-center">
                            <Link to="/login" className="text-dark">
                              <i className="mdi mdi-arrow-left"></i> Back to Login
                            </Link>
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
};

export default PasswordForget;
