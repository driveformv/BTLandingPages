# Admin Dashboard Documentation

The admin dashboard provides a comprehensive interface for managing job listings and applications. It features a modern, responsive design that matches the main website's look and feel, with a focus on usability and efficiency.

## Features

### Authentication
- Secure login for administrators
- Protected routes that require authentication
- Logout functionality

### Dashboard Overview
- Quick statistics showing total jobs, applications, and pending applications
- Recent applications list with status indicators
- Quick action buttons for common tasks

### Jobs Management
- View all job listings in a sortable, searchable table
- Add new job listings with title, description, requirements, and active status
- Edit existing job listings
- Delete job listings (with confirmation)
- Toggle job visibility (active/inactive)

### Applications Management
- View all applications in a sortable, searchable table
- Filter applications by status and position
- Download applications as CSV for offline processing
- View detailed application information including:
  - Applicant details (name, email, phone)
  - Position applied for
  - Resume download
  - Application date
  - Status tracking

### Application Status Workflow
- Update application status through the workflow:
  - Pending (default)
  - Reviewed
  - Interviewed
  - Hired
  - Rejected
- Visual status indicators with appropriate colors

## Technical Implementation

### File Structure
- `src/pages/Admin/` - Contains all admin dashboard components
  - `AdminLayout.js` - Main layout with sidebar navigation
  - `AdminStyles.css` - Styling for admin components
  - `Dashboard.js` - Main dashboard view with statistics
  - `JobsManagement.js` - Jobs listing and management
  - `ApplicationsManagement.js` - Applications listing and management
  - `ApplicationDetail.js` - Detailed view of a single application

### Data Management
- Firebase Firestore for data storage
- Collections:
  - `jobs` - Job listings
  - `jobApplications` - Application submissions

### Styling
- Responsive design that works on all device sizes
- Consistent styling with the main website
- Uses the Border Tire orange color scheme (#f09105)
- Material Design Icons for visual elements

## Usage Guide

### Accessing the Admin Dashboard
1. Navigate to `/login` and sign in with your admin credentials
2. After successful login, you'll be redirected to the admin dashboard

### Managing Jobs
1. Click on "Manage Jobs" in the sidebar
2. View existing jobs in the table
3. Click "Add New Job" to create a new job listing
4. Fill in the required fields and click "Add Job"
5. To edit a job, click the "Edit" button on the job row
6. To delete a job, click the "Delete" button (requires confirmation)

### Managing Applications
1. Click on "Applications" in the sidebar
2. View all applications in the table
3. Use the filters to narrow down applications by status or position
4. Click "Download CSV" to export the current filtered list
5. Click "View" on any application to see detailed information

### Reviewing an Application
1. Navigate to the application details page
2. Review the applicant's information and resume
3. Update the status using the status buttons
4. Contact the applicant directly using the "Contact Applicant" button

## Security Considerations

- The admin dashboard is protected by Firebase Authentication
- Only authenticated users can access admin routes
- Firestore security rules restrict access to admin functions
- Sensitive applicant data is protected

## Future Enhancements

- Email notifications for new applications
- Bulk actions for applications (e.g., bulk status updates)
- Advanced filtering and sorting options
- Interview scheduling integration
- Analytics dashboard for application trends
