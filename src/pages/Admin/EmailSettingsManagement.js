import React, { useState, useEffect } from 'react';
import { getEmailSettings, updateEmailSettings } from '../../firestoreAdmin';

const EmailSettingsManagement = () => {
  const [settings, setSettings] = useState({
    to: [],
    cc: [],
    bcc: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [emailType, setEmailType] = useState('to');

  // Fetch email settings on component mount
  useEffect(() => {
    fetchEmailSettings();
  }, []);

  // Fetch email settings from Firestore
  const fetchEmailSettings = async () => {
    try {
      setLoading(true);
      const emailSettings = await getEmailSettings();
      if (emailSettings) {
        setSettings({
          to: emailSettings.to || [],
          cc: emailSettings.cc || [],
          bcc: emailSettings.bcc || []
        });
      } else {
        // If no settings exist, create default settings
        const defaultSettings = {
          to: ["sanhe@m-v-t.com"],
          cc: [],
          bcc: []
        };
        await updateEmailSettings(defaultSettings);
        setSettings(defaultSettings);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching email settings:', error);
      setError('Failed to load email settings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await updateEmailSettings(settings);
      setSuccess('Email settings updated successfully!');
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating email settings:', error);
      setError('Failed to update email settings. Please try again.');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  // Add email to the selected type (to, cc, bcc)
  const addEmail = () => {
    if (!newEmail) return;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    // Check if email already exists in the selected type
    if (settings[emailType].includes(newEmail)) {
      setError(`${newEmail} is already in the ${emailType.toUpperCase()} list.`);
      return;
    }
    
    setSettings({
      ...settings,
      [emailType]: [...settings[emailType], newEmail]
    });
    
    setNewEmail('');
    setError(null);
  };

  // Remove email from the selected type
  const removeEmail = (type, email) => {
    setSettings({
      ...settings,
      [type]: settings[type].filter(e => e !== email)
    });
  };

  if (loading && !settings.to.length) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p className="admin-loading-text">Loading email settings...</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Email Notification Settings</h2>
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
      
      {success && (
        <div className="admin-card mb-4">
          <div className="admin-card-body">
            <div className="alert alert-success mb-0">
              <i className="mdi mdi-check-circle me-2"></i>
              {success}
            </div>
          </div>
        </div>
      )}
      
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <i className="mdi mdi-email-outline me-2"></i>
            Recruiter Notification Email Settings
          </h3>
        </div>
        <div className="admin-card-body">
          <p className="mb-4">
            Configure the email recipients for job application notifications. These settings will be used when sending notification emails to recruiters.
          </p>
          
          <form onSubmit={handleSubmit}>
            {/* Email Lists */}
            <div className="mb-4">
              <h4 className="mb-3">Current Recipients</h4>
              
              {/* TO Recipients */}
              <div className="mb-4">
                <h5 className="mb-2">
                  <i className="mdi mdi-account-outline me-2"></i>
                  To
                </h5>
                {settings.to.length === 0 ? (
                  <div className="alert alert-warning">
                    <i className="mdi mdi-alert me-2"></i>
                    No primary recipients configured. At least one recipient is required.
                  </div>
                ) : (
                  <div className="email-list">
                    {settings.to.map((email, index) => (
                      <div key={index} className="email-item">
                        <span className="email-text">{email}</span>
                        <button
                          type="button"
                          className="email-remove-btn"
                          onClick={() => removeEmail('to', email)}
                        >
                          <i className="mdi mdi-close"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* CC Recipients */}
              <div className="mb-4">
                <h5 className="mb-2">
                  <i className="mdi mdi-account-multiple-outline me-2"></i>
                  Cc
                </h5>
                {settings.cc.length === 0 ? (
                  <p className="text-muted">No CC recipients configured.</p>
                ) : (
                  <div className="email-list">
                    {settings.cc.map((email, index) => (
                      <div key={index} className="email-item">
                        <span className="email-text">{email}</span>
                        <button
                          type="button"
                          className="email-remove-btn"
                          onClick={() => removeEmail('cc', email)}
                        >
                          <i className="mdi mdi-close"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* BCC Recipients */}
              <div className="mb-4">
                <h5 className="mb-2">
                  <i className="mdi mdi-account-multiple-outline me-2"></i>
                  Bcc
                </h5>
                {settings.bcc.length === 0 ? (
                  <p className="text-muted">No BCC recipients configured.</p>
                ) : (
                  <div className="email-list">
                    {settings.bcc.map((email, index) => (
                      <div key={index} className="email-item">
                        <span className="email-text">{email}</span>
                        <button
                          type="button"
                          className="email-remove-btn"
                          onClick={() => removeEmail('bcc', email)}
                        >
                          <i className="mdi mdi-close"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Add New Email */}
            <div className="admin-form-group mb-4">
              <h4 className="mb-3">Add New Recipient</h4>
              <div className="d-flex">
                <select
                  className="admin-form-control me-2"
                  style={{ width: '100px' }}
                  value={emailType}
                  onChange={(e) => setEmailType(e.target.value)}
                >
                  <option value="to">To</option>
                  <option value="cc">Cc</option>
                  <option value="bcc">Bcc</option>
                </select>
                <input
                  type="email"
                  className="admin-form-control me-2"
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={addEmail}
                >
                  <i className="mdi mdi-plus me-1"></i>
                  Add
                </button>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={loading || settings.to.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-content-save me-1"></i>
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* CSS for email items */}
      <style jsx="true">{`
        .email-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        
        .email-item {
          display: flex;
          align-items: center;
          background-color: #f0f0f0;
          border-radius: 4px;
          padding: 4px 8px;
        }
        
        .email-text {
          margin-right: 8px;
        }
        
        .email-remove-btn {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          padding: 0;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};

export default EmailSettingsManagement;
