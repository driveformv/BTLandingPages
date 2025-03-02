import { Resend } from 'resend';

// Initialize Resend with API key
// In a production environment, this should be stored in environment variables
let resend;
try {
  resend = new Resend(process.env.REACT_APP_RESEND_API_KEY || 're_dummy_key_for_development');
  console.log('Resend initialized with API key');
} catch (error) {
  console.error('Error initializing Resend:', error);
  // Create a mock resend object for development
  resend = {
    emails: {
      send: async (options) => {
        console.log('Mock email send:', options);
        return { id: 'mock-email-id', message: 'Mock email sent' };
      }
    }
  };
}

/**
 * Send a confirmation email to the applicant
 * @param {string} to - Recipient email address
 * @param {string} name - Applicant's name
 * @returns {Promise} - Promise resolving to the email send result
 */
export const sendApplicantConfirmationEmail = async (to, name) => {
  try {
    const data = await resend.emails.send({
      from: 'no-reply@bordertire.com',
      to,
      subject: 'Border Tire: Application Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Your Application</h2>
          <p>Dear ${name},</p>
          <p>Thanks for applying! We've received your information, and a recruiter will contact you soon.</p>
          <p>If you have any questions, please contact our HR department.</p>
          <p>Best regards,<br>Border Tire Recruitment Team</p>
        </div>
      `,
    });
    
    console.log('Confirmation email sent to applicant:', data);
    return data;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

/**
 * Send a notification email to the recruiter
 * @param {string} to - Recruiter email address
 * @param {Object} applicationData - Applicant's form data
 * @param {string} resumeLink - Link to the applicant's resume
 * @returns {Promise} - Promise resolving to the email send result
 */
export const sendRecruiterNotificationEmail = async (to, applicationData, resumeLink) => {
  try {
    // Format the application data for the email
    const formattedData = Object.entries(applicationData)
      .map(([key, value]) => {
        // Skip the resume file object in the email
        if (key === 'resume') return null;
        
        // Format the key for better readability
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
          .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
        
        return `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">${formattedKey}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${value}</td>
        </tr>`;
      })
      .filter(Boolean) // Remove null entries
      .join('');

    const data = await resend.emails.send({
      from: 'no-reply@bordertire.com',
      to,
      subject: 'New Job Application Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Job Application</h2>
          <p>You've received a new application. Here are the details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
              ${formattedData}
            </tbody>
          </table>
          
          <p><strong>Resume:</strong> <a href="${resumeLink}" target="_blank">View Resume</a></p>
          
          <p>Please review this application at your earliest convenience.</p>
        </div>
      `,
    });
    
    console.log('Notification email sent to recruiter:', data);
    return data;
  } catch (error) {
    console.error('Error sending recruiter notification email:', error);
    throw error;
  }
};
