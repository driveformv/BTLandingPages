import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getApplication, updateApplicationStatus, getAllJobListings } from '../../firestoreAdmin';

const ApplicationDetail = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [statusOptions] = useState([
    { value: 'pending', label: 'Pending', icon: 'mdi-clock-outline', color: 'warning' },
    { value: 'reviewed', label: 'Reviewed', icon: 'mdi-eye-outline', color: 'info' },
    { value: 'interviewed', label: 'Interviewed', icon: 'mdi-account-voice', color: 'primary' },
    { value: 'hired', label: 'Hired', icon: 'mdi-check-circle-outline', color: 'success' },
    { value: 'rejected', label: 'Rejected', icon: 'mdi-close-circle-outline', color: 'danger' }
  ]);

  const fetchApplicationData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch application
      const applicationData = await getApplication(id);
      if (!applicationData) {
        setError('Application not found');
        setLoading(false);
        return;
      }
      
      setApplication(applicationData);
      
      // Fetch job details if we have a preferred role
      if (applicationData.preferredRole) {
        try {
          const jobs = await getAllJobListings();
          const jobData = jobs.find(j => j.id === applicationData.preferredRole);
          setJob(jobData || null);
        } catch (error) {
          console.error('Error fetching job details:', error);
          // We don't set an error here because the application data is more important
        }
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching application:', error);
      setError('Failed to load application. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchApplicationData();
  }, [fetchApplicationData]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setStatusUpdateLoading(true);
      await updateApplicationStatus(id, newStatus);
      
      // Update local state
      setApplication({
        ...application,
        status: newStatus
      });
      
      setStatusUpdateLoading(false);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status. Please try again.');
      setStatusUpdateLoading(false);
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p className="admin-loading-text">Loading application details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card">
        <div className="admin-card-body">
          <div className="alert alert-danger mb-3">
            <i className="mdi mdi-alert-circle me-2"></i>
            {error}
          </div>
          <Link to="/admin/applications" className="admin-btn admin-btn-primary">
            <i className="mdi mdi-arrow-left admin-btn-icon"></i>
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="admin-card">
        <div className="admin-card-body">
          <div className="admin-empty-state">
            <i className="mdi mdi-file-document-outline admin-empty-icon"></i>
            <h3 className="admin-empty-title">Application Not Found</h3>
            <p className="admin-empty-description">
              The application you're looking for doesn't exist or has been deleted.
            </p>
            <Link to="/admin/applications" className="admin-btn admin-btn-primary">
              <i className="mdi mdi-arrow-left admin-btn-icon"></i>
              Back to Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <Link to="/admin/applications" className="admin-btn admin-btn-light admin-btn-icon-only me-3">
            <i className="mdi mdi-arrow-left"></i>
          </Link>
          <h2 className="mb-0">Application Details</h2>
        </div>
        <div className="d-flex gap-2">
          {application.resumeURL && (
            <a 
              href={application.resumeURL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="admin-btn admin-btn-primary"
            >
              <i className="mdi mdi-file-pdf-outline admin-btn-icon"></i>
              View Resume
            </a>
          )}
        </div>
      </div>
      
      {/* Status Card */}
      <div className="admin-card mb-4">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <i className="mdi mdi-tag-outline admin-card-icon"></i>
            Application Status
          </h3>
        </div>
        <div className="admin-card-body">
          <div className="d-flex flex-wrap align-items-center mb-3">
            <span className="me-3 mb-2">Current Status:</span>
            <span className={`status-badge status-badge-${application.status || 'pending'} mb-2`}>
              <i className={`status-badge-icon mdi ${getStatusIcon(application.status)}`}></i>
              {getStatusLabel(application.status)}
            </span>
          </div>
          
          <div className="d-flex flex-wrap gap-2">
            <span className="me-2 d-flex align-items-center">Change Status:</span>
            {statusOptions.map(option => (
              <button
                key={option.value}
                className={`admin-btn ${application.status === option.value ? 'admin-btn-' + option.color : 'admin-btn-outline-' + option.color} admin-btn-sm`}
                onClick={() => handleStatusUpdate(option.value)}
                disabled={statusUpdateLoading || application.status === option.value}
              >
                <i className={`mdi ${option.icon} admin-btn-icon`}></i>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Applicant Information */}
      <div className="admin-card mb-4">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <i className="mdi mdi-account-outline admin-card-icon"></i>
            Applicant Information
          </h3>
        </div>
        <div className="admin-card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="mb-3">
                <h5 className="text-muted mb-1">Full Name</h5>
                <p className="fs-5 fw-medium mb-0">{application.fullName || 'N/A'}</p>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="mb-3">
                <h5 className="text-muted mb-1">Email</h5>
                <p className="fs-5 mb-0">
                  <a href={`mailto:${application.email}`} className="text-decoration-none">
                    {application.email || 'N/A'}
                  </a>
                </p>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="mb-3">
                <h5 className="text-muted mb-1">Phone</h5>
                <p className="fs-5 mb-0">
                  {application.phone ? (
                    <a href={`tel:${application.phone}`} className="text-decoration-none">
                      {application.phone}
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="mb-3">
                <h5 className="text-muted mb-1">Application Date</h5>
                <p className="fs-5 mb-0">{formatDate(application.applicationDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Job Information */}
      <div className="admin-card mb-4">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <i className="mdi mdi-briefcase-outline admin-card-icon"></i>
            Position Information
          </h3>
        </div>
        <div className="admin-card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="mb-3">
                <h5 className="text-muted mb-1">Applied Position</h5>
                <p className="fs-5 fw-medium mb-0">
                  {job ? job.title : application.preferredRole || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="mb-3">
                <h5 className="text-muted mb-1">Experience</h5>
                <p className="fs-5 mb-0">{application.experience || 'N/A'}</p>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="mb-3">
                <h5 className="text-muted mb-1">Availability</h5>
                <p className="fs-5 mb-0">{application.availability || 'N/A'}</p>
              </div>
            </div>
            
            {job && (
              <div className="col-12">
                <div className="mb-3">
                  <h5 className="text-muted mb-1">Job Description</h5>
                  <p className="mb-0">{job.description || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Additional Information */}
      {application.additionalInfo && (
        <div className="admin-card mb-4">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <i className="mdi mdi-text-box-outline admin-card-icon"></i>
              Additional Information
            </h3>
          </div>
          <div className="admin-card-body">
            <p className="mb-0">{application.additionalInfo}</p>
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="d-flex justify-content-between">
        <Link to="/admin/applications" className="admin-btn admin-btn-light">
          <i className="mdi mdi-arrow-left admin-btn-icon"></i>
          Back to Applications
        </Link>
        
        <div className="d-flex gap-2">
          {application.email && (
            <a 
              href={`mailto:${application.email}?subject=Regarding Your Job Application`} 
              className="admin-btn admin-btn-primary"
            >
              <i className="mdi mdi-email-outline admin-btn-icon"></i>
              Contact Applicant
            </a>
          )}
        </div>
      </div>
    </>
  );
};

// Helper function to get the appropriate icon for a status
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

// Helper function to get the label for a status
const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'reviewed':
      return 'Reviewed';
    case 'interviewed':
      return 'Interviewed';
    case 'hired':
      return 'Hired';
    case 'rejected':
      return 'Rejected';
    default:
      return 'Pending';
  }
};

export default ApplicationDetail;
