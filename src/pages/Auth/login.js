import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Input,
  Form,
  FormFeedback,
  Alert,
  Spinner
} from "reactstrap";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { signIn } from "../../authService";
import { useAuth } from "../../contexts/AuthContext";

//Import Home Button
import AccountHomeButton from "./account-home-button";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/admin/dashboard");
    }
  }, [currentUser, navigate]);
  
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
        username: '',
        password: '',
    },
    validationSchema: Yup.object({
        username: Yup.string().required("Please Enter Your UserName"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Please Enter Your Password")
    }),
    onSubmit: async (values) => {
        try {
          setError("");
          setLoading(true);
          await signIn(values.username, values.password);
          // Redirect will happen automatically due to the useEffect above
        } catch (error) {
          console.error("Login error:", error);
          setError(
            error.code === "auth/invalid-credential"
              ? "Invalid email or password"
              : "Failed to sign in. Please try again."
          );
        } finally {
          setLoading(false);
        }
    }
});

  useEffect(() => {
    document.body.classList.add("bg-account-pages");
    document.body.classList.add("py-4");
    document.body.classList.add("py-sm-0");
    
    // Check if colorTheme element exists before trying to set its attribute
    const colorThemeElement = document.getElementById("colorTheme");
    if (colorThemeElement) {
      colorThemeElement.setAttribute("href", "assets/colors/orange.css");
    }

    // Define the cleanup function to remove the added classes
    return () => {
      document.body.classList.remove("bg-account-pages");
      document.body.classList.remove("py-4");
      document.body.classList.remove("py-sm-0");
      
      // Check if colorTheme element exists before trying to set its attribute
      const colorThemeElement = document.getElementById("colorTheme");
      if (colorThemeElement) {
        colorThemeElement.setAttribute("href", "assets/colors/cyan.css");
      }
    };
  }, []);
    return (
      <React.Fragment>
        {/* render home button */}
        <AccountHomeButton />

        <Link to="#" id="mode" className="mode-btn text-white" onClick={() => toggleThem()}>
          <i className="mdi mdi-weather-sunny bx-spin mode-light"></i>
          <i className="mdi mdi-moon-waning-crescent mode-dark"></i>
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
                          <p className="text-muted">
                            Sign in to continue to Border Tire.
                          </p>
                        </div>
                        <div className="p-4">
                          {error && (
                            <Alert color="danger" className="mb-4">
                              {error}
                            </Alert>
                          )}
                          <Form
                           onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                        }}
                          >
                            <div className="form-group">
                              <Label for="username">Username</Label>
                              <Input
                                name="username"
                                className="form-control "
                                placeholder="Enter username"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.username || ""}
                                invalid={
                                    validation.touched.username && validation.errors.username ? true : false
                                }
                            />
                            {validation.touched.username && validation.errors.username ? (
                                <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                            ) : null}
                            </div>

                            <div className="form-group mt-3">
                              <Label for="userpassword">Password</Label>
                              <Input
                                name="password"
                                className="form-control "
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

                            <div className="custom-control custom-checkbox mt-2">
                              <Input
                                type="checkbox"
                                className="custom-control-input"
                                id="customControlInline"
                              />{" "}
                              <Label
                                className="custom-control-label"
                                for="customControlInline"
                              >
                                   &nbsp;Remember me
                              </Label>
                            </div>

                            <div className="d-grid mt-3">
                              <Button
                                type="submit"
                                className="btn btn-orange"
                                disabled={loading}
                              >
                                {loading ? (
                                  <Spinner size="sm" className="me-2" />
                                ) : null}
                                {loading ? "Signing In..." : "Log In"}
                              </Button>
                            </div>

                            <div className="mt-4 mb-0 text-center">
                              <Link to="/password_forget" className="text-dark">
                                <i className="mdi mdi-lock"></i> Forgot your
                                password?
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
  }
export default Login;
