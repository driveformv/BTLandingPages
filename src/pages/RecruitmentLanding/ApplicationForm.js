import React, { Component } from "react";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, FormFeedback, Alert } from "reactstrap";
import RecruitmentSectionTitle from "./RecruitmentSectionTitle";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import { addDocument, updateDocument, getDocuments } from "../../firestoreService";
import { uploadResume } from "../../storageService";
import { analytics } from "../../firebase";
import { logEvent } from "firebase/analytics";
// Email sending is now handled by Firebase Cloud Functions

// File size validation (5MB max)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const SUPPORTED_FORMATS = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

class ApplicationForm extends Component {
  static propTypes = {
    inHeroSection: PropTypes.bool
  };

  static defaultProps = {
    inHeroSection: false
  };

  constructor(props) {
    super(props);
    this.state = {
      formSubmitted: false,
      submitError: null,
      selectedFileName: "",
      jobs: [],
      loadingJobs: true,
      jobsError: null,
      utmParams: {}
    };
  }

  componentDidMount() {
    this.fetchJobs();
    this.captureUtmParams();
  }

  // Extract UTM parameters from URL and store in localStorage
  captureUtmParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const utmParams = {
      utm_source: searchParams.get('utm_source') || null,
      utm_medium: searchParams.get('utm_medium') || null,
      utm_campaign: searchParams.get('utm_campaign') || null,
      utm_term: searchParams.get('utm_term') || null,
      utm_content: searchParams.get('utm_content') || null
    };

    // Filter out null values
    const filteredUtmParams = Object.fromEntries(
      Object.entries(utmParams).filter(([_, value]) => value !== null)
    );

    // Only store if at least one UTM parameter is present
    if (Object.keys(filteredUtmParams).length > 0) {
      localStorage.setItem('utmParams', JSON.stringify(filteredUtmParams));
      this.setState({ utmParams: filteredUtmParams });
    } else {
      // Try to get UTM params from localStorage if not in URL
      const storedUtmParams = localStorage.getItem('utmParams');
      if (storedUtmParams) {
        this.setState({ utmParams: JSON.parse(storedUtmParams) });
      }
    }
  }

  fetchJobs = async () => {
    try {
      console.log("Fetching jobs from Firestore...");
      // Fetch jobs from Firestore
      const jobsFromFirestore = await getDocuments("jobs");
      console.log("Jobs from Firestore:", jobsFromFirestore);
      
      if (jobsFromFirestore.length === 0) {
        console.log("No jobs found in Firestore");
        this.setState({ 
          jobsError: "No job listings found. Please try again later.",
          loadingJobs: false
        });
      } else {
        console.log("Setting jobs in state:", jobsFromFirestore);
        this.setState({ 
          jobs: jobsFromFirestore,
          loadingJobs: false
        });
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      this.setState({ 
        jobsError: "Failed to load job listings. Please try again later.",
        loadingJobs: false
      });
    }
  };

  handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      this.setState({ selectedFileName: file.name });
      setFieldValue("resume", file);
    }
  };

  handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log("Form values:", values);
      
      // Get UTM parameters from state or localStorage
      let utmParams = this.state.utmParams;
      if (Object.keys(utmParams).length === 0) {
        const storedUtmParams = localStorage.getItem('utmParams');
        if (storedUtmParams) {
          utmParams = JSON.parse(storedUtmParams);
        }
      }
      
      // First, save basic application data to get an ID
      const initialData = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        experience: values.experience,
        preferredRole: values.preferredRole,
        availability: values.availability,
        applicationDate: new Date(),
        status: "pending", // Initial status of the application
        emailsSent: false, // Will be updated by the Cloud Function
        resumeUploaded: false,
        // Include UTM parameters if available
        ...utmParams
      };
      
      // Save initial application data to Firestore to get an ID
      const docRef = await addDocument("jobApplications", initialData);
      const applicationId = docRef.id;
      console.log("Application saved with ID:", applicationId);
      
      // Upload the resume file to Firebase Storage
      let resumeData = null;
      if (values.resume) {
        this.setState({ isUploading: true });
        
        try {
          // Upload the resume and get the download URL
          resumeData = await uploadResume(values.resume, applicationId);
          console.log("Resume uploaded:", resumeData);
          
          // Update the application with the resume information
          const resumeUpdateData = {
            resumeFilename: resumeData.filename,
            resumeURL: resumeData.downloadURL,
            resumeOriginalName: values.resume.name,
            resumeUploaded: true
          };
          
          // Update the application document with resume information
          await updateDocument("jobApplications", applicationId, resumeUpdateData);
          console.log("Application updated with resume information");
        } catch (uploadError) {
          console.error("Error uploading resume:", uploadError);
          // Continue with the form submission even if resume upload fails
          // The application is already saved, and we can notify the user about the upload issue
        } finally {
          this.setState({ isUploading: false });
        }
      }
      
      // Track the application submission event in Firebase Analytics
      logEvent(analytics, 'application_submitted', {
        job_role: values.preferredRole,
        experience_level: values.experience,
        utm_source: utmParams.utm_source || 'direct',
        application_id: applicationId
      });
      
      // Reset form and show success message
      resetForm();
      this.setState({ 
        formSubmitted: true, 
        submitError: null,
        selectedFileName: ""
      });
      
      // Scroll to the top of the form to show the success message
      const formElement = document.getElementById("application");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      this.setState({ 
        submitError: "There was an error submitting your application. Please try again." 
      });
    } finally {
      setSubmitting(false);
    }
  };

  render() {
    const { formSubmitted, submitError, selectedFileName, utmParams } = this.state;
    const { inHeroSection } = this.props;
    
    const initialValues = {
      fullName: "",
      email: "",
      phone: "",
      experience: "",
      preferredRole: "",
      availability: "",
      resume: null
    };

    const validationSchema = Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      experience: Yup.string().required("Work experience is required"),
      preferredRole: Yup.string().required("Please select a preferred role"),
      availability: Yup.string().required("Availability information is required"),
      resume: Yup.mixed()
        .required("Resume is required")
        .test("fileSize", "File size is too large (max 5MB)", 
          value => value && value.size <= MAX_FILE_SIZE)
        .test("fileType", "Unsupported file format. Please upload PDF, DOC, or DOCX", 
          value => value && SUPPORTED_FORMATS.includes(value.type))
    });

    // If in hero section, we'll use a more compact layout
    if (inHeroSection) {
      return (
        <React.Fragment>
          <div id="application-form-container">
            <h4 className="text-center mb-3" style={{ color: "#f37423" }}>Apply Now</h4>
            
            {formSubmitted ? (
              <Alert color="success" className="mt-2">
                <h5 className="alert-heading">Application Submitted!</h5>
                <p className="small mb-0">
                  Thank you for your interest in joining the Border Tire family! We have received your application and will review it shortly.
                </p>
              </Alert>
            ) : (
              <div className="custom-form mt-2">
                {submitError && (
                  <Alert color="danger" className="small py-2">{submitError}</Alert>
                )}
                
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={this.handleSubmit}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue
                  }) => (
                    <Form id="application-form" onSubmit={handleSubmit}>
                        <FormGroup className="mb-2">
                        <Input
                          type="text"
                          name="fullName"
                          id="fullName"
                          placeholder="Full Name *"
                          value={values.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!(touched.fullName && errors.fullName)}
                          className="divi-style-input"
                        />
                        <FormFeedback className="small">{errors.fullName}</FormFeedback>
                      </FormGroup>
                      
                      <FormGroup>
                        <Input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Email Address *"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!(touched.email && errors.email)}
                          className="divi-style-input"
                        />
                        <FormFeedback className="small">{errors.email}</FormFeedback>
                      </FormGroup>
                      
                      <FormGroup>
                        <Input
                          type="tel"
                          name="phone"
                          id="phone"
                          placeholder="Phone Number *"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!(touched.phone && errors.phone)}
                          className="divi-style-input"
                        />
                        <FormFeedback className="small">{errors.phone}</FormFeedback>
                      </FormGroup>
                      
                      <FormGroup>
                        <Input
                          type="select"
                          name="experience"
                          id="experience"
                          value={values.experience}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!(touched.experience && errors.experience)}
                          className="divi-style-input"
                        >
                          <option value="">Work Experience *</option>
                          <option value="0-1">Less than 1 year</option>
                          <option value="1-3">1-3 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5+">5+ years</option>
                        </Input>
                        <FormFeedback className="small">{errors.experience}</FormFeedback>
                      </FormGroup>
                      
                      <FormGroup>
                        <Input
                          type="select"
                          name="preferredRole"
                          id="preferredRole"
                          value={values.preferredRole}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!(touched.preferredRole && errors.preferredRole)}
                          className="divi-style-input"
                        >
                          <option value="">Preferred Role *</option>
                          {this.state.loadingJobs ? (
                            <option value="" disabled>Loading jobs...</option>
                          ) : this.state.jobsError ? (
                            <option value="" disabled>{this.state.jobsError}</option>
                          ) : (
                            this.state.jobs.map(job => (
                              <option key={job.id} value={job.id}>
                                {job.title}
                              </option>
                            ))
                          )}
                        </Input>
                        <FormFeedback className="small">{errors.preferredRole}</FormFeedback>
                      </FormGroup>
                      
                      <FormGroup>
                        <Input
                          type="select"
                          name="availability"
                          id="availability"
                          value={values.availability}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!(touched.availability && errors.availability)}
                          className="divi-style-input"
                        >
                          <option value="">Availability *</option>
                          <option value="immediate">Immediate</option>
                          <option value="2weeks">2 weeks notice</option>
                          <option value="1month">1 month notice</option>
                          <option value="other">Other (specify in resume)</option>
                        </Input>
                        <FormFeedback className="small">{errors.availability}</FormFeedback>
                      </FormGroup>
                      
                      <FormGroup>
                        <div className="custom-file divi-style-file">
                          <Input
                            type="file"
                            className="custom-file-input"
                            id="resume"
                            name="resume"
                            onChange={(event) => this.handleFileChange(event, setFieldValue)}
                            onBlur={handleBlur}
                            invalid={!!(touched.resume && errors.resume)}
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          />
                          <Label className="custom-file-label" for="resume">
                            {selectedFileName || "Resume Upload (PDF, DOC) *"}
                          </Label>
                        </div>
                        {touched.resume && errors.resume && (
                          <div className="text-danger mt-1 small">{errors.resume}</div>
                        )}
                      </FormGroup>
                      
                      <div className="text-center" style={{ marginTop: '3rem' }}>
                        <Button
                          color="orange"
                          type="submit"
                          disabled={isSubmitting}
                          size="sm"
                          className="text-white"
                          style={{ backgroundColor: "#f37423", borderColor: "#f37423" }}
                        >
                          {isSubmitting ? "Submitting..." : "Send Application"}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
          </div>
        </React.Fragment>
      );
    }
    
    // Standard full-page application form
    return (
      <React.Fragment>
        <section className="section" id="application">
          <Container>
            <RecruitmentSectionTitle
              title="How to Apply – Your New Career Starts Here 📢"
              description="Ready to take the next step? Applying is easy and quick. It only takes a few minutes to potentially change your life!"
            />

            <Row className="justify-content-center">
              <Col lg={8}>
                {formSubmitted ? (
                  <Alert color="success" className="mt-4">
                    <h4 className="alert-heading">Application Submitted!</h4>
                    <p>
                      Thank you for your interest in joining the Border Tire family! We have received your application and will review it shortly.
                    </p>
                    <p>
                      You will receive a confirmation email at the address you provided. We're hiring for 30 immediate openings, so we review applications daily!
                    </p>
                    <hr />
                    <p className="mb-0">
                      <Button 
                        color="link" 
                        className="p-0" 
                        onClick={() => this.setState({ formSubmitted: false })}
                      >
                        Submit another application
                      </Button>
                    </p>
                  </Alert>
                ) : (
                  <div id="application-form-container" className="custom-form mt-4">
                    {submitError && (
                      <Alert color="danger">{submitError}</Alert>
                    )}
                    
    {/* UTM Parameters Debug Section - Removed from production display */}
    {false && process.env.NODE_ENV === 'development' && Object.keys(utmParams).length > 0 && (
      <Alert color="info" className="mb-4">
        <h5>UTM Parameters Detected</h5>
        <pre className="mb-0">
          {JSON.stringify(utmParams, null, 2)}
        </pre>
      </Alert>
    )}
                    
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={this.handleSubmit}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue
                      }) => (
                        <Form id="application-form" onSubmit={handleSubmit}>
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="fullName">Full Name *</Label>
                                <Input
                                  type="text"
                                  name="fullName"
                                  id="fullName"
                                  placeholder="Enter your full name"
                                  value={values.fullName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={!!(touched.fullName && errors.fullName)}
                                />
                                <FormFeedback>{errors.fullName}</FormFeedback>
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="email">Email *</Label>
                                <Input
                                  type="email"
                                  name="email"
                                  id="email"
                                  placeholder="Enter your email"
                                  value={values.email}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={!!(touched.email && errors.email)}
                                />
                                <FormFeedback>{errors.email}</FormFeedback>
                              </FormGroup>
                            </Col>
                          </Row>
                          
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="phone">Phone Number *</Label>
                                <Input
                                  type="tel"
                                  name="phone"
                                  id="phone"
                                  placeholder="Enter your phone number"
                                  value={values.phone}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={!!(touched.phone && errors.phone)}
                                />
                                <FormFeedback>{errors.phone}</FormFeedback>
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="experience">Work Experience *</Label>
                                <Input
                                  type="select"
                                  name="experience"
                                  id="experience"
                                  value={values.experience}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={!!(touched.experience && errors.experience)}
                                >
                                  <option value="">Select experience level</option>
                                  <option value="0-1">Less than 1 year</option>
                                  <option value="1-3">1-3 years</option>
                                  <option value="3-5">3-5 years</option>
                                  <option value="5+">5+ years</option>
                                </Input>
                                <FormFeedback>{errors.experience}</FormFeedback>
                              </FormGroup>
                            </Col>
                          </Row>
                          
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="preferredRole">Preferred Role *</Label>
                                <Input
                                  type="select"
                                  name="preferredRole"
                                  id="preferredRole"
                                  value={values.preferredRole}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={!!(touched.preferredRole && errors.preferredRole)}
                                >
                                  <option value="">Select a position</option>
                                  {this.state.loadingJobs ? (
                                    <option value="" disabled>Loading jobs...</option>
                                  ) : this.state.jobsError ? (
                                    <option value="" disabled>{this.state.jobsError}</option>
                                  ) : (
                                    this.state.jobs.map(job => (
                                      <option key={job.id} value={job.id}>
                                        {job.title}
                                      </option>
                                    ))
                                  )}
                                </Input>
                                <FormFeedback>{errors.preferredRole}</FormFeedback>
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="availability">Availability *</Label>
                                <Input
                                  type="select"
                                  name="availability"
                                  id="availability"
                                  value={values.availability}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={!!(touched.availability && errors.availability)}
                                >
                                  <option value="">Select availability</option>
                                  <option value="immediate">Immediate</option>
                                  <option value="2weeks">2 weeks notice</option>
                                  <option value="1month">1 month notice</option>
                                  <option value="other">Other (specify in resume)</option>
                                </Input>
                                <FormFeedback>{errors.availability}</FormFeedback>
                              </FormGroup>
                            </Col>
                          </Row>
                          
                          <FormGroup>
                            <Label for="resume">Resume Upload (PDF, DOC, DOCX, max 5MB) *</Label>
                            <div className="custom-file">
                              <Input
                                type="file"
                                className="custom-file-input"
                                id="resume"
                                name="resume"
                                onChange={(event) => this.handleFileChange(event, setFieldValue)}
                                onBlur={handleBlur}
                                invalid={!!(touched.resume && errors.resume)}
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              />
                              <Label className="custom-file-label" for="resume">
                                {selectedFileName || "Choose file"}
                              </Label>
                            </div>
                            {touched.resume && errors.resume && (
                              <div className="text-danger mt-1 small">{errors.resume}</div>
                            )}
                          </FormGroup>
                          
                          <div className="text-center" style={{ marginTop: '6rem' }}>
                            <Button
                              color="orange"
                              type="submit"
                              disabled={isSubmitting}
                              size="lg"
                              className="text-white"
                              style={{ fontSize: '18px', padding: '15px 30px' }}
                            >
                              {isSubmitting ? "Submitting..." : "Send Application"}
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default ApplicationForm;
