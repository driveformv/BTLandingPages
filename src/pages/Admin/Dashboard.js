import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { getDocuments } from '../../firestoreService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    recentApplications: []
  });
  const [jobsMap, setJobsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch jobs
        const jobs = await getDocuments('jobs');
        
        // Create a map of job IDs to job titles
        const jobsMapping = {};
        jobs.forEach(job => {
          jobsMapping[job.id] = job.title;
        });
        setJobsMap(jobsMapping);
        
        // Fetch applications
        const applications = await getDocuments('jobApplications');
        
        // Calculate stats
        const pendingApplications = applications.filter(app => app.status === 'pending');
        
        // Sort applications by date (newest first) and take the first 5
        const recentApplications = [...applications]
          .sort((a, b) => {
            const dateA = a.applicationDate ? new Date(a.applicationDate.seconds * 1000) : new Date(0);
            const dateB = b.applicationDate ? new Date(b.applicationDate.seconds * 1000) : new Date(0);
            return dateB - dateA;
          })
          .slice(0, 5);
        
        setStats({
          totalJobs: jobs.length,
          totalApplications: applications.length,
          pendingApplications: pendingApplications.length,
          recentApplications
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  };

  // Get job title by ID
  const getJobTitle = (jobId) => {
    return jobsMap[jobId] || 'Unknown Position';
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p className="admin-loading-text">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card">
        <div className="admin-card-body">
          <div className="alert alert-danger mb-0">
            <i className="mdi mdi-alert-circle me-2"></i>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card stat-card-primary">
          <div className="stat-card-icon">
            <i className="mdi mdi-briefcase"></i>
          </div>
          <div className="stat-card-content">
            <p className="stat-card-label">Total Jobs</p>
            <h2 className="stat-card-value">{stats.totalJobs}</h2>
            <div className="stat-card-action">
              <Link to="/admin/jobs" className="admin-btn admin-btn-primary admin-btn-sm">
                <i className="mdi mdi-eye admin-btn-icon"></i>
                Manage Jobs
              </Link>
            </div>
          </div>
        </div>
        
        <div className="stat-card stat-card-info">
          <div className="stat-card-icon">
            <i className="mdi mdi-file-document"></i>
          </div>
          <div className="stat-card-content">
            <p className="stat-card-label">Total Applications</p>
            <h2 className="stat-card-value">{stats.totalApplications}</h2>
            <div className="stat-card-action">
              <Link to="/admin/applications" className="admin-btn admin-btn-info admin-btn-sm">
                <i className="mdi mdi-eye admin-btn-icon"></i>
                View All
              </Link>
            </div>
          </div>
        </div>
        
        <div className="stat-card stat-card-warning">
          <div className="stat-card-icon">
            <i className="mdi mdi-clock-outline"></i>
          </div>
          <div className="stat-card-content">
            <p className="stat-card-label">Pending Applications</p>
            <h2 className="stat-card-value">{stats.pendingApplications}</h2>
            <div className="stat-card-action">
              <Link to="/admin/applications?status=pending" className="admin-btn admin-btn-warning admin-btn-sm">
                <i className="mdi mdi-eye admin-btn-icon"></i>
                Review Pending
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Applications */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h2 className="admin-table-title">
            <i className="mdi mdi-file-document-multiple-outline admin-table-icon"></i>
            Recent Applications
          </h2>
          <div className="admin-table-actions">
            <Link to="/admin/applications" className="admin-btn admin-btn-outline-primary admin-btn-sm">
              <i className="mdi mdi-arrow-right admin-btn-icon"></i>
              View All
            </Link>
          </div>
        </div>
        
        {stats.recentApplications.length === 0 ? (
          <div className="admin-empty-state">
            <i className="mdi mdi-file-document-outline admin-empty-icon"></i>
            <h3 className="admin-empty-title">No applications yet</h3>
            <p className="admin-empty-description">
              Applications will appear here once candidates apply for your job listings.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th><i className="mdi mdi-account me-1"></i> Name</th>
                  <th><i className="mdi mdi-briefcase me-1"></i> Position</th>
                  <th><i className="mdi mdi-calendar me-1"></i> Date</th>
                  <th><i className="mdi mdi-tag me-1"></i> Status</th>
                  <th><i className="mdi mdi-cog me-1"></i> Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentApplications.map(application => (
                  <tr key={application.id}>
                    <td className="fw-medium">{application.fullName}</td>
                    <td>{getJobTitle(application.preferredRole)}</td>
                    <td>{formatDate(application.applicationDate)}</td>
                    <td>
                      <span className={`status-badge status-badge-${application.status || 'pending'}`}>
                        <i className={`status-badge-icon mdi ${getStatusIcon(application.status)}`}></i>
                        {application.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      <Link 
                        to={`/admin/applications/${application.id}`} 
                        className="admin-btn admin-btn-primary admin-btn-sm"
                      >
                        <i className="mdi mdi-eye me-1"></i> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Quick Actions Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            <i className="mdi mdi-lightning-bolt admin-card-icon"></i>
            Quick Actions
          </h2>
        </div>
        <div className="admin-card-body">
          <Row>
            <Col md={4} className="mb-3 mb-md-0">
              <Link to="/admin/jobs" className="admin-btn admin-btn-primary w-100">
                <i className="mdi mdi-plus-circle admin-btn-icon"></i>
                Add New Job
              </Link>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <Link to="/admin/applications" className="admin-btn admin-btn-info w-100">
                <i className="mdi mdi-file-document-outline admin-btn-icon"></i>
                Manage Applications
              </Link>
            </Col>
            <Col md={4}>
              <Link to="/admin/applications?status=pending" className="admin-btn admin-btn-warning w-100">
                <i className="mdi mdi-clock-outline admin-btn-icon"></i>
                Review Pending
              </Link>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

// Helper function to get the appropriate icon for a status badge
const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return 'mdi-clock-outline';
    case 'reviewed':
      return 'mdi-eye-outline';
    case 'interviewed':
      return 'mdi-account-voice';
    case 'hired':
      return 'mdi-check-circle-outline';
    case 'rejected':
      return 'mdi-close-circle-outline';
    default:
      return 'mdi-clock-outline';
  }
};

export default Dashboard;
