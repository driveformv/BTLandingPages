import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { getAllApplications, getApplicationsForJob, getAllJobListings } from '../../firestoreAdmin';

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || '');
  const [filterJob, setFilterJob] = useState(searchParams.get('job') || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('applicationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Fetch applications and jobs on component mount
  useEffect(() => {
    fetchApplicationsAndJobs();
  }, []);

  // Fetch applications and jobs from Firestore
  const fetchApplicationsAndJobs = async () => {
    try {
      setLoading(true);
      
      // Fetch all jobs
      const jobsData = await getAllJobListings();
      setJobs(jobsData);
      
      // Fetch applications based on filters
      let applicationsData;
      if (filterJob) {
        applicationsData = await getApplicationsForJob(filterJob);
      } else {
        applicationsData = await getAllApplications();
      }
      
      // Apply status filter if needed
      if (filterStatus) {
        applicationsData = applicationsData.filter(app => app.status === filterStatus);
      }
      
      setApplications(applicationsData);
      setError(null);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (filterJob) params.job = filterJob;
    setSearchParams(params);
    fetchApplicationsAndJobs();
  };

  // Reset filters
  const resetFilters = () => {
    setFilterStatus('');
    setFilterJob('');
    setSearchTerm('');
    setSearchParams({});
    fetchApplicationsAndJobs();
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get sorted and filtered applications
  const getFilteredApplications = () => {
    // First apply search filter
    let filtered = [...applications];
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        (app.fullName && app.fullName.toLowerCase().includes(search)) ||
        (app.email && app.email.toLowerCase().includes(search))
      );
    }
    
    // Then sort
    return filtered.sort((a, b) => {
      let valueA, valueB;
      
      // Handle different field types
      if (sortField === 'applicationDate') {
        valueA = a.applicationDate ? new Date(a.applicationDate.seconds * 1000) : new Date(0);
        valueB = b.applicationDate ? new Date(b.applicationDate.seconds * 1000) : new Date(0);
      } else if (sortField === 'fullName' || sortField === 'email' || sortField === 'status') {
        valueA = a[sortField] || '';
        valueB = b[sortField] || '';
      } else {
        valueA = a[sortField];
        valueB = b[sortField];
      }
      
      // Compare based on direction
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  // Get job title by ID
  const getJobTitle = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : 'Unknown Position';
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  };

  // Download applications as CSV
  const downloadApplicationsCSV = () => {
    try {
      setDownloadLoading(true);
      
      // Get filtered applications
      const filteredApplications = getFilteredApplications();
      
      // Define CSV headers
      const headers = [
        'Full Name',
        'Email',
        'Phone',
        'Position',
        'Experience',
        'Availability',
        'Application Date',
        'Status',
        'Resume Link'
      ];
      
      // Create CSV content
      let csvContent = headers.join(',') + '\n';
      
      // Add application data
      filteredApplications.forEach(app => {
        const jobTitle = getJobTitle(app.preferredRole);
        const applicationDate = app.applicationDate 
          ? new Date(app.applicationDate.seconds * 1000).toISOString() 
          : 'N/A';
        
        const row = [
          `"${app.fullName || ''}"`,
          `"${app.email || ''}"`,
          `"${app.phone || ''}"`,
          `"${jobTitle}"`,
          `"${app.experience || ''}"`,
          `"${app.availability || ''}"`,
          `"${applicationDate}"`,
          `"${app.status || ''}"`,
          `"${app.resumeURL || ''}"`,
        ];
        
        csvContent += row.join(',') + '\n';
      });
      
      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadLoading(false);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      setError('Failed to download applications. Please try again.');
      setDownloadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p className="admin-loading-text">Loading applications...</p>
      </div>
    );
  }

  const filteredApplications = getFilteredApplications();

  return (
    <>
      {/* Page Title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Job Applications</h2>
        <div>
          <button 
            className="admin-btn admin-btn-primary admin-btn-sm me-2"
            onClick={downloadApplicationsCSV}
            disabled={downloadLoading || applications.length === 0}
          >
            {downloadLoading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Downloading...
              </>
            ) : (
              <>
                <i className="mdi mdi-download admin-btn-icon"></i>
                Download CSV
              </>
            )}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="admin-card mb-4">
          <div className="admin-card-body">
            <div className="alert alert-danger mb-0">
              <i className="mdi mdi-alert-circle me-2"></i>
              {error}
            </div>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="admin-filter-section">
        <h3 className="admin-filter-title">
          <i className="mdi mdi-filter-variant admin-filter-icon"></i>
          Filter Applications
        </h3>
        <div className="admin-filter-form">
          <div className="admin-filter-group">
            <label className="admin-form-label">Status</label>
            <select
              className="admin-form-control admin-form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="interviewed">Interviewed</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="admin-filter-group">
            <label className="admin-form-label">Position</label>
            <select
              className="admin-form-control admin-form-select"
              value={filterJob}
              onChange={(e) => setFilterJob(e.target.value)}
            >
              <option value="">All Positions</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="admin-filter-group">
            <label className="admin-form-label">Search</label>
            <div className="admin-search-box">
              <i className="mdi mdi-magnify admin-search-icon"></i>
              <input
                type="text"
                className="admin-form-control admin-search-input"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="admin-filter-actions">
            <button className="admin-btn admin-btn-primary" onClick={applyFilters}>
              <i className="mdi mdi-filter admin-btn-icon"></i>
              Apply Filters
            </button>
            <button className="admin-btn admin-btn-light" onClick={resetFilters}>
              <i className="mdi mdi-refresh admin-btn-icon"></i>
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Applications Table */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3 className="admin-table-title">
            <i className="mdi mdi-file-document-multiple-outline admin-table-icon"></i>
            Applications
          </h3>
          <div className="admin-table-actions">
            <span className="text-muted me-2">
              {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'} found
            </span>
          </div>
        </div>
        
        {filteredApplications.length === 0 ? (
          <div className="admin-empty-state">
            <i className="mdi mdi-file-document-outline admin-empty-icon"></i>
            <h3 className="admin-empty-title">No applications found</h3>
            <p className="admin-empty-description">
              Try adjusting your filters or search criteria.
            </p>
            <button className="admin-btn admin-btn-primary" onClick={resetFilters}>
              <i className="mdi mdi-refresh admin-btn-icon"></i>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th 
                    onClick={() => handleSort('fullName')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="mdi mdi-account me-1"></i>
                      Name
                      {sortField === 'fullName' && (
                        <i className={`mdi mdi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('email')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="mdi mdi-email me-1"></i>
                      Email
                      {sortField === 'email' && (
                        <i className={`mdi mdi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                      )}
                    </div>
                  </th>
                  <th>
                    <i className="mdi mdi-briefcase me-1"></i>
                    Position
                  </th>
                  <th 
                    onClick={() => handleSort('applicationDate')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="mdi mdi-calendar me-1"></i>
                      Date
                      {sortField === 'applicationDate' && (
                        <i className={`mdi mdi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('status')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="mdi mdi-tag me-1"></i>
                      Status
                      {sortField === 'status' && (
                        <i className={`mdi mdi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                      )}
                    </div>
                  </th>
                  <th>
                    <i className="mdi mdi-file-pdf me-1"></i>
                    Resume
                  </th>
                  <th>
                    <i className="mdi mdi-cog me-1"></i>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(application => (
                  <tr key={application.id}>
                    <td className="fw-medium">{application.fullName}</td>
                    <td>{application.email}</td>
                    <td>{getJobTitle(application.preferredRole)}</td>
                    <td>{formatDate(application.applicationDate)}</td>
                    <td>
                      <span className={`status-badge status-badge-${application.status || 'pending'}`}>
                        <i className={`status-badge-icon mdi ${getStatusIcon(application.status)}`}></i>
                        {application.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      {application.resumeURL ? (
                        <a 
                          href={application.resumeURL} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="admin-btn admin-btn-light admin-btn-sm"
                        >
                          <i className="mdi mdi-file-pdf-outline me-1"></i>
                          View
                        </a>
                      ) : (
                        <span className="text-muted">No resume</span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/admin/applications/${application.id}`}
                        className="admin-btn admin-btn-primary admin-btn-sm"
                      >
                        <i className="mdi mdi-eye me-1"></i>
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

export default ApplicationsManagement;
