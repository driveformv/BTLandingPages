import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminStyles.css';
import { logOut } from '../../authService';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setError('');
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to log out');
    }
  };

  // Close mobile menu on location change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser || !currentUser.email) return '?';
    
    const email = currentUser.email;
    const nameParts = email.split('@')[0].split('.');
    
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else {
      return email.substring(0, 2).toUpperCase();
    }
  };

  // Check if a menu item is active
  const isMenuItemActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'admin-sidebar-collapsed' : ''} ${mobileMenuOpen ? 'show' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <Link to="/admin/dashboard" className="d-flex align-items-center">
            <img 
              src="/assets/images/logo/Border Tire-03.png" 
              alt="Border Tire Logo" 
              className="sidebar-logo"
            />
          </Link>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className={`mdi ${sidebarCollapsed ? 'mdi-chevron-right' : 'mdi-chevron-left'}`}></i>
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <Link 
              to="/admin/dashboard" 
              className={`sidebar-menu-link ${isMenuItemActive('/admin/dashboard') ? 'active' : ''}`}
            >
              <i className="mdi mdi-view-dashboard sidebar-menu-icon"></i>
              <span className="sidebar-menu-text">Dashboard</span>
            </Link>
          </li>
          <li className="sidebar-menu-item">
            <Link 
              to="/admin/jobs" 
              className={`sidebar-menu-link ${isMenuItemActive('/admin/jobs') ? 'active' : ''}`}
            >
              <i className="mdi mdi-briefcase-outline sidebar-menu-icon"></i>
              <span className="sidebar-menu-text">Manage Jobs</span>
            </Link>
          </li>
          <li className="sidebar-menu-item">
            <Link 
              to="/admin/applications" 
              className={`sidebar-menu-link ${isMenuItemActive('/admin/applications') ? 'active' : ''}`}
            >
              <i className="mdi mdi-file-document-outline sidebar-menu-icon"></i>
              <span className="sidebar-menu-text">Applications</span>
            </Link>
          </li>
          <li className="sidebar-menu-item">
            <Link 
              to="/admin/email-settings" 
              className={`sidebar-menu-link ${isMenuItemActive('/admin/email-settings') ? 'active' : ''}`}
            >
              <i className="mdi mdi-email-outline sidebar-menu-icon"></i>
              <span className="sidebar-menu-text">Email Settings</span>
            </Link>
          </li>
        </ul>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {getUserInitials()}
            </div>
            <div className="user-details">
              <p className="user-name">{currentUser?.email}</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <i className="mdi mdi-logout logout-icon"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <button 
            className="d-md-none admin-btn admin-btn-light admin-btn-icon-only me-3"
            onClick={toggleMobileMenu}
          >
            <i className="mdi mdi-menu"></i>
          </button>
          
          <h1 className="page-title">
            {location.pathname.includes('/dashboard') && 'Dashboard'}
            {location.pathname.includes('/jobs') && 'Manage Jobs'}
            {location.pathname.includes('/applications') && location.pathname.includes('/applications/') ? 'Application Details' : ''}
            {location.pathname === '/admin/applications' && 'Applications'}
            {location.pathname.includes('/email-settings') && 'Email Settings'}
          </h1>

          {error && (
            <div className="alert alert-danger ms-auto">{error}</div>
          )}
        </header>

        {/* Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
