import React, { useState, useEffect } from 'react';
import { 
  getAllJobListings, 
  addJobListing, 
  updateJobListing, 
  deleteJobListing,
  syncJobsFromXmlFeed,
  markBorderTireJobsActive
} from '../../firestoreAdmin';

const JobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    isActive: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [syncing, setSyncing] = useState(false);
  const [activating, setActivating] = useState(false);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch jobs from Firestore
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await getAllJobListings();
      setJobs(jobsData);
      setError(null);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Open form for adding a new job
  const openAddForm = () => {
    setFormData({
      title: '',
      description: '',
      requirements: '',
      isActive: true
    });
    setEditingJob(null);
    setIsFormOpen(true);
  };

  // Open form for editing an existing job
  const openEditForm = (job) => {
    setFormData({
      title: job.title || '',
      description: job.description || '',
      requirements: job.requirements || '',
      isActive: job.isActive !== false // Default to true if not specified
    });
    setEditingJob(job);
    setIsFormOpen(true);
  };

  // Close form
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingJob(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingJob) {
        // Update existing job
        await updateJobListing(editingJob.id, formData);
      } else {
        // Add new job
        await addJobListing(formData);
      }
      
      // Refresh jobs list
      await fetchJobs();
      
      // Close form
      closeForm();
    } catch (error) {
      console.error('Error saving job:', error);
      setError('Failed to save job. Please try again.');
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteJobListing(jobId);
      await fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Failed to delete job. Please try again.');
    }
  };
  
  // Handle job sync from XML feed
  const handleSyncJobs = async () => {
    try {
      setSyncing(true);
      setError(null);
      
      const result = await syncJobsFromXmlFeed();
      
      // Show success message
      alert(`Jobs synced successfully!\n\nAdded: ${result.summary.addedCount}\nUpdated: ${result.summary.updatedCount}\nInactivated: ${result.summary.inactivatedCount}`);
      
      // Refresh jobs list
      await fetchJobs();
    } catch (error) {
      console.error('Error syncing jobs:', error);
      setError('Failed to sync jobs from XML feed. Please try again later.');
    } finally {
      setSyncing(false);
    }
  };

  // Handle marking all Border Tire jobs as active
  const handleActivateJobs = async () => {
    try {
      setActivating(true);
      setError(null);
      
      const result = await markBorderTireJobsActive();
      
      // Show success message
      if (result.updatedJobs && result.updatedJobs.length > 0) {
        alert(`Successfully marked ${result.updatedJobs.length} Border Tire jobs as active.`);
      } else {
        alert('All Border Tire jobs are already active.');
      }
      
      // Refresh jobs list
      await fetchJobs();
    } catch (error) {
      console.error('Error activating jobs:', error);
      setError('Failed to mark Border Tire jobs as active. Please try again later.');
    } finally {
      setActivating(false);
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get filtered and sorted jobs
  const getFilteredJobs = () => {
    // First apply search filter
    let filtered = [...jobs];
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        (job.title && job.title.toLowerCase().includes(search)) ||
        (job.description && job.description.toLowerCase().includes(search))
      );
    }
    
    // Then sort
    return filtered.sort((a, b) => {
      let valueA = a[sortField] || '';
      let valueB = b[sortField] || '';
      
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();
      
      // Compare based on direction
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p className="admin-loading-text">Loading jobs...</p>
      </div>
    );
  }

  const filteredJobs = getFilteredJobs();

  return (
    <>
      {/* Page Title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Jobs</h2>
        <div className="d-flex gap-2">
          <button 
            className="admin-btn admin-btn-secondary"
            onClick={handleSyncJobs}
            disabled={syncing || activating}
          >
            <i className={`mdi ${syncing ? 'mdi-loading mdi-spin' : 'mdi-sync'} admin-btn-icon`}></i>
            {syncing ? 'Syncing...' : 'Sync Jobs'}
          </button>
          <button 
            className="admin-btn admin-btn-success"
            onClick={handleActivateJobs}
            disabled={syncing || activating}
          >
            <i className={`mdi ${activating ? 'mdi-loading mdi-spin' : 'mdi-check-all'} admin-btn-icon`}></i>
            {activating ? 'Activating...' : 'Activate All Jobs'}
          </button>
          <button 
            className="admin-btn admin-btn-primary"
            onClick={openAddForm}
          >
            <i className="mdi mdi-plus-circle admin-btn-icon"></i>
            Add New Job
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
      
      {/* Search */}
      <div className="admin-filter-section mb-4">
        <div className="admin-filter-form">
          <div className="admin-filter-group flex-grow-1">
            <div className="admin-search-box">
              <i className="mdi mdi-magnify admin-search-icon"></i>
              <input
                type="text"
                className="admin-form-control admin-search-input"
                placeholder="Search jobs by title or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Jobs Table */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3 className="admin-table-title">
            <i className="mdi mdi-briefcase-outline admin-table-icon"></i>
            Job Listings
          </h3>
          <div className="admin-table-actions">
            <span className="text-muted me-2">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
            </span>
          </div>
        </div>
        
        {filteredJobs.length === 0 ? (
          <div className="admin-empty-state">
            <i className="mdi mdi-briefcase-outline admin-empty-icon"></i>
            <h3 className="admin-empty-title">No jobs found</h3>
            <p className="admin-empty-description">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Add your first job to get started.'}
            </p>
            {searchTerm ? (
              <button className="admin-btn admin-btn-primary" onClick={() => setSearchTerm('')}>
                <i className="mdi mdi-refresh admin-btn-icon"></i>
                Clear Search
              </button>
            ) : (
              <button className="admin-btn admin-btn-primary" onClick={openAddForm}>
                <i className="mdi mdi-plus-circle admin-btn-icon"></i>
                Add New Job
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th 
                    onClick={() => handleSort('title')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="mdi mdi-briefcase me-1"></i>
                      Title
                      {sortField === 'title' && (
                        <i className={`mdi mdi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                      )}
                    </div>
                  </th>
                  <th>Description</th>
                  <th>Requirements</th>
                  <th 
                    onClick={() => handleSort('isActive')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="mdi mdi-tag me-1"></i>
                      Status
                      {sortField === 'isActive' && (
                        <i className={`mdi mdi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                      )}
                    </div>
                  </th>
                  <th>
                    <i className="mdi mdi-cog me-1"></i>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map(job => (
                  <tr key={job.id}>
                    <td className="fw-medium">{job.title}</td>
                    <td>
                      {job.description && job.description.length > 100
                        ? `${job.description.substring(0, 100)}...`
                        : job.description}
                    </td>
                    <td>
                      {job.requirements && job.requirements.length > 100
                        ? `${job.requirements.substring(0, 100)}...`
                        : job.requirements}
                    </td>
                    <td>
                      <span className={`status-badge status-badge-${job.isActive !== false ? 'active' : 'inactive'}`}>
                        <i className={`status-badge-icon mdi ${job.isActive !== false ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'}`}></i>
                        {job.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="admin-btn admin-btn-info admin-btn-sm"
                          onClick={() => openEditForm(job)}
                        >
                          <i className="mdi mdi-pencil me-1"></i>
                          Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <i className="mdi mdi-delete me-1"></i>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Improved Job Form Modal */}
      {isFormOpen && (
        <div className="admin-modal-overlay" onClick={(e) => {
          // Close modal when clicking outside
          if (e.target.className === 'admin-modal-overlay') {
            closeForm();
          }
        }}>
          <div className="admin-modal">
            <div className="admin-modal-content">
              <div className="admin-modal-header">
                <h5 className="admin-modal-title">
                  <i className={`mdi ${editingJob ? 'mdi-pencil' : 'mdi-plus-circle'} me-2`}></i>
                  {editingJob ? 'Edit Job' : 'Add New Job'}
                </h5>
                <button 
                  type="button" 
                  className="admin-modal-close" 
                  onClick={closeForm}
                >
                  <i className="mdi mdi-close"></i>
                </button>
              </div>
              <div className="admin-modal-body">
                <form onSubmit={handleSubmit} className="admin-form">
                  <div className="admin-form-group">
                    <label className="admin-form-label" htmlFor="title">
                      <i className="mdi mdi-briefcase-outline me-1"></i>
                      Job Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="admin-form-control"
                      id="title"
                      name="title"
                      placeholder="Enter job title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                    <small className="admin-form-text">
                      A clear, concise title that describes the position
                    </small>
                  </div>
                  
                  <div className="admin-form-group">
                    <label className="admin-form-label" htmlFor="description">
                      <i className="mdi mdi-text-box-outline me-1"></i>
                      Job Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="admin-form-control"
                      id="description"
                      name="description"
                      rows="5"
                      placeholder="Enter detailed job description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                    <small className="admin-form-text">
                      Provide a comprehensive description of the role, responsibilities, and expectations
                    </small>
                  </div>
                  
                  <div className="admin-form-group">
                    <label className="admin-form-label" htmlFor="requirements">
                      <i className="mdi mdi-clipboard-list-outline me-1"></i>
                      Requirements <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="admin-form-control"
                      id="requirements"
                      name="requirements"
                      rows="5"
                      placeholder="Enter job requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                    <small className="admin-form-text">
                      List qualifications, skills, experience, and education requirements
                    </small>
                  </div>
                  
                  <div className="admin-form-switch mb-4">
                    <div className="d-flex align-items-center">
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="isActive"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label ms-2" htmlFor="isActive">
                          <span className={`status-badge status-badge-${formData.isActive ? 'active' : 'inactive'}`}>
                            <i className={`status-badge-icon mdi ${formData.isActive ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'}`}></i>
                            {formData.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </label>
                      </div>
                    </div>
                    <small className="admin-form-text mt-1">
                      Active jobs are visible to applicants on the recruitment page
                    </small>
                  </div>
                  
                  <div className="admin-modal-footer">
                    <button
                      type="button"
                      className="admin-btn admin-btn-light"
                      onClick={closeForm}
                    >
                      <i className="mdi mdi-close me-1"></i>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="admin-btn admin-btn-primary"
                    >
                      <i className={`mdi ${editingJob ? 'mdi-content-save' : 'mdi-plus-circle'} me-1`}></i>
                      {editingJob ? 'Update Job' : 'Add Job'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobsManagement;
