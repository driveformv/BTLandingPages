import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, Button, Spinner } from "reactstrap";
import RecruitmentSectionTitle from "./RecruitmentSectionTitle";
import { getDocuments } from "../../firestoreService";

// Fallback job data in case Firestore fetch fails
const fallbackJobs = [
  {
    id: "1",
    title: "Production Operator",
    description: "Operate machinery and equipment in the retread tire production process.",
    requirements: "1-2 years of manufacturing experience preferred."
  },
  {
    id: "2",
    title: "Quality Control Specialist",
    description: "Ensure all retread tires meet quality standards through inspection and testing.",
    requirements: "Experience in quality control or inspection required."
  },
  {
    id: "3",
    title: "Maintenance Technician",
    description: "Perform preventative maintenance and repairs on production equipment.",
    requirements: "Mechanical aptitude and troubleshooting skills required."
  },
  {
    id: "4",
    title: "Warehouse Associate",
    description: "Handle inventory management and shipping/receiving operations.",
    requirements: "Forklift certification preferred."
  },
  {
    id: "5",
    title: "Plant Supervisor",
    description: "Oversee daily operations and lead a team of production workers.",
    requirements: "3+ years of supervisory experience in manufacturing."
  }
];

class JobListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchJobs();
  }

  fetchJobs = async () => {
    try {
      // Check if jobs collection exists in Firestore
      const jobsFromFirestore = await getDocuments("jobs");
      
      // If no jobs in Firestore yet, use fallback data
      if (jobsFromFirestore.length === 0) {
        this.setState({ jobs: fallbackJobs, loading: false });
      } else {
        this.setState({ jobs: jobsFromFirestore, loading: false });
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      this.setState({ 
        jobs: fallbackJobs, 
        loading: false, 
        error: "Failed to load job listings. Using default data instead." 
      });
    }
  };
  scrollToApplication = (jobId) => {
    const applicationForm = document.getElementById("application");
    if (applicationForm) {
      applicationForm.scrollIntoView({ behavior: "smooth" });
      
      // Set the selected job in a form dropdown if it exists
      const jobSelect = document.getElementById("preferredRole");
      if (jobSelect) {
        jobSelect.value = jobId;
      }
    }
  };

  render() {
    const { jobs, loading, error } = this.state;

    return (
      <React.Fragment>
        <section className="section" id="jobs">
          <Container>
            <RecruitmentSectionTitle
              title="About the Retread Technician Role"
              description="As a Retread Technician, you'll learn to give worn tires a second life using Michelin's cutting-edge retread process."
            />

            {loading ? (
              <div className="text-center my-5">
                <Spinner color="primary" />
                <p className="mt-2">Loading job listings...</p>
              </div>
            ) : error ? (
              <div className="alert alert-warning mt-4">{error}</div>
            ) : (
              <Row className="mt-4">
                <Col lg={12} className="mb-4">
                  <Card className="border-0 shadow rounded">
                    <CardBody>
                      <h4>What You'll Do as a Retread Technician</h4>
                      <p className="text-muted">Using Michelin's cutting-edge retread process, you will:</p>
                      <ul className="text-muted">
                        <li>Inspect tires for damage or wear, ensuring they're fit for retreading</li>
                        <li>Buff and prepare tires, removing old treads</li>
                        <li>Apply new tread rubber to the tire with specialized equipment</li>
                        <li>Cure and finish the tire, making it look and perform like new</li>
                        <li>Quality-check everything – we take pride in doing it right the first time</li>
                      </ul>
                      <p className="text-muted">Don't worry if you've never done this before – we will train you every step of the way. You'll work with advanced machinery and learn skills that can last a lifetime.</p>
                      
                      <h4 className="mt-4">Who Should Apply?</h4>
                      <p className="text-muted">We're looking for motivated, reliable individuals who are ready to grow. If you:</p>
                      <ul className="text-muted">
                        <li>Have a strong work ethic and positive attitude</li>
                        <li>Enjoy working with your hands and as part of a team</li>
                        <li>Are willing to learn and follow our proven processes</li>
                        <li>Value safety and take pride in a job well done</li>
                      </ul>
                      <p className="text-muted">...then you're a perfect fit! Whether you're just starting your career, switching industries, or looking for a fresh start, Border Tire MRT welcomes you.</p>
                      
                      <div className="text-center mt-4">
                        <Button 
                          color="orange" 
                          onClick={() => this.scrollToApplication("retread-technician")}
                          className="mt-2 btn-lg"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                
                {jobs.length > 0 && (
                  <Col lg={12}>
                    <h4 className="mb-3">Other Available Positions</h4>
                    <Row>
                      {jobs.map((job) => (
                        <Col lg={4} md={6} key={job.id} className="mt-4">
                          <Card className="job-card border-0 shadow rounded">
                            <CardBody>
                              <h5>{job.title}</h5>
                              <p className="text-muted small">{job.description}</p>
                              <Button 
                                color="orange" 
                                onClick={() => this.scrollToApplication(job.id)}
                                className="mt-2 btn-sm"
                                size="sm"
                              >
                                Apply Now
                              </Button>
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                )}
              </Row>
            )}
          </Container>
        </section>
      </React.Fragment>
    );
  }
}

export default JobListings;
