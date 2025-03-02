# Resend Email Integration

This document provides information on how the Resend email service is integrated into the Border Tire recruitment landing page.

## Overview

Resend is used to send automated email notifications when a job application is submitted:

1. **Applicant Confirmation Email**: Sent to the applicant to confirm their application was received.
2. **Recruiter Notification Email**: Sent to the recruiter with the applicant's details and resume link.

## Configuration

### Environment Variables

The Resend API key is stored in the `.env` file at the root of the project:

```
REACT_APP_RESEND_API_KEY=your_resend_api_key_here
```

**Important**: Replace `your_resend_api_key_here` with your actual Resend API key. Never commit the `.env` file with the actual API key to version control.

### Email Sender

Emails are sent from `no-reply@bordertire.com`. This can be changed in the `emailService.js` file.

## Implementation Details

### Files

- **`src/emailService.js`**: Contains the functions for sending emails using Resend.
- **`src/pages/RecruitmentLanding/ApplicationForm.js`**: Integrates the email service into the form submission process.

### Email Functions

1. **`sendApplicantConfirmationEmail(to, name)`**: Sends a confirmation email to the applicant.
2. **`sendRecruiterNotificationEmail(to, applicationData, resumeLink)`**: Sends a notification email to the recruiter with the applicant's details.

## Email Content

### Applicant Confirmation Email

- **Subject**: Border Tire: Application Received
- **Content**: A thank you message confirming the application was received and that a recruiter will contact them soon.

### Recruiter Notification Email

- **Subject**: New Job Application Received
- **Content**: The applicant's form data formatted in a table and a link to the applicant's resume.

## Customization

To modify the email content or styling, edit the HTML templates in the `emailService.js` file.

## Troubleshooting

If emails are not being sent:

1. Check that the Resend API key is correctly set in the `.env` file.
2. Verify that the Resend package is installed (`npm install resend`).
3. Check the browser console for any error messages related to email sending.
4. Ensure the email addresses are valid.

## Resources

- [Resend Documentation](https://resend.com/docs)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
