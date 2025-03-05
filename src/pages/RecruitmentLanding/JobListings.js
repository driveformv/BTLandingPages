import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, Button, Spinner } from "reactstrap";
import RecruitmentSectionTitle from "./RecruitmentSectionTitle";
import { getDocuments } from "../../firestoreService";
import "./RecruitmentStyles.css";

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
      error: null,
      expandedJobs: {} // Track which jobs are expanded
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
    const target = document.getElementById("application-form-container") || document.getElementById("application") || document.getElementById("hero-application");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      const jobSelect = document.getElementById("preferredRole");
      if (jobSelect) {
        jobSelect.value = jobId;
      }
    }
  };

  // Toggle job description expansion
  toggleJobDescription = (jobId) => {
    this.setState(prevState => ({
      expandedJobs: {
        ...prevState.expandedJobs,
        [jobId]: !prevState.expandedJobs[jobId]
      }
    }));
  };

  // Truncate description for preview
  truncateDescription = (description, isExpanded) => {
    if (!description) return "";
    
    // If expanded, show full description
    if (isExpanded) return description;
    
    // Otherwise, truncate to ~100 characters
    const maxLength = 100;
    if (description.length <= maxLength) return description;
    
    // Find the last space before maxLength to avoid cutting words
    const truncated = description.substr(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return truncated.substr(0, lastSpace) + '...';
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
                              {(job.city || job.state) && (
                                <div className="job-location text-muted small mb-2">
                                  <i className="mdi mdi-map-marker me-1"></i>
                                  {[job.city, job.state].filter(Boolean).join(', ')}
                                </div>
                              )}
                              <div className="job-description-container">
                                <div 
                                  className="text-muted small job-description" 
                                  dangerouslySetInnerHTML={{ 
                                    __html: this.truncateDescription(
                                      job.description, 
                                      this.state.expandedJobs[job.id]
                                    ) 
                                  }}
                                />
                                
                                {job.description && job.description.length > 100 && (
                                  <Button 
                                    color="link" 
                                    className="read-more-btn p-0 mt-1"
                                    onClick={() => this.toggleJobDescription(job.id)}
                                  >
                                    {this.state.expandedJobs[job.id] ? 'Show Less' : 'Read More'}
                                  </Button>
                                )}
                              </div>
                              
                              <Button 
                                color="orange" 
                                onClick={() => this.scrollToApplication(job.id)}
                                className="mt-1 btn-sm"
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
