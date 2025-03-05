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
              title="Other Available Positions"
              description="Explore additional career opportunities at Border Tire"
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
                {jobs.length > 0 && (
                  <Col lg={12}>
                    <Row>
                      {jobs.map((job) => (
                        <Col lg={6} md={6} key={job.id} className="mt-4">
                          <Card className="job-card border-0 shadow rounded">
                            <CardBody>
                              <h5>{job.title}</h5>
                              <div 
                                className="text-muted small" 
                                dangerouslySetInnerHTML={{ __html: job.description }}
                              />
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
