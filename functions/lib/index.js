"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmail = exports.sendApplicationEmails = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const resend_1 = require("resend");
const createEmailSettings_1 = require("./createEmailSettings");
// Initialize Firebase Admin
admin.initializeApp();
// Create email settings document if it doesn't exist
(0, createEmailSettings_1.createEmailSettings)()
    .then(() => console.log('Email settings initialization complete'))
    .catch((error) => console.error('Email settings initialization failed:', error));
// Initialize Resend with API key from environment variables
const resend = new resend_1.Resend(functions.config().resend.api_key);
/**
 * Cloud Function triggered when a new job application is created in Firestore
 * Sends confirmation email to applicant and notification email to recruiter
 */
exports.sendApplicationEmails = functions.firestore
    .document('jobApplications/{applicationId}')
    .onWrite(async (change, context) => {
    // Get the document after the change
    const afterData = change.after.data();
    // If document was deleted or doesn't exist, exit
    if (!afterData) {
        console.log('Document was deleted or does not exist');
        return null;
    }
    // If emails were already sent, exit
    if (afterData.emailsSent === true) {
        console.log('Emails were already sent for this application');
        return null;
    }
    // If resume URL is not available yet, exit
    if (!afterData.resumeURL) {
        console.log('Resume URL not available yet, waiting for update');
        return null;
    }
    try {
        const applicationData = afterData;
        const applicationId = context.params.applicationId;
        console.log(`Processing application ${applicationId} for ${applicationData.fullName}`);
        // Get the resume link from the application data
        const resumeLink = applicationData.resumeURL;
        // Send confirmation email to the applicant
        const applicantEmailResult = await sendApplicantConfirmationEmail(applicationData.email, applicationData.fullName);
        console.log('Confirmation email sent to applicant:', applicantEmailResult);
        // Get email settings from Firestore
        const emailSettingsRef = admin.firestore().collection('settings').doc('emailNotifications');
        const emailSettingsDoc = await emailSettingsRef.get();
        let emailSettings = {
            to: ["sanhe@m-v-t.com"], // Default to original hardcoded email
            cc: [],
            bcc: []
        };
        if (emailSettingsDoc.exists) {
            const data = emailSettingsDoc.data();
            if (data) {
                emailSettings = {
                    to: data.to || emailSettings.to,
                    cc: data.cc || emailSettings.cc,
                    bcc: data.bcc || emailSettings.bcc
                };
            }
        }
        else {
            // If email settings don't exist, create them with default values
            try {
                await emailSettingsRef.set(emailSettings);
                console.log('Created default email settings');
            }
            catch (error) {
                console.error('Error creating default email settings:', error);
            }
        }
        // Send notification email to the recruiter(s)
        const recruiterEmailResult = await sendRecruiterNotificationEmail(emailSettings, applicationData, resumeLink);
        console.log('Notification email sent to recruiters:', recruiterEmailResult);
        // Update the application record to indicate emails were sent
        await admin.firestore().collection('jobApplications').doc(applicationId).update({
            emailsSent: true,
            emailSentTimestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error sending application emails:', error);
        return { error: error.message };
    }
});
/**
 * Send a confirmation email to the applicant
 * @param to - Recipient email address
 * @param name - Applicant's name
 * @returns Promise resolving to the email send result
 */
async function sendApplicantConfirmationEmail(to, name) {
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
        return data;
    }
    catch (error) {
        console.error('Error sending confirmation email:', error);
        throw error;
    }
}
/**
 * Send a notification email to the recruiter
 * @param emailSettings - Email settings with to, cc, and bcc recipients
 * @param applicationData - Applicant's form data
 * @param resumeLink - Link to the applicant's resume
 * @returns Promise resolving to the email send result
 */
async function sendRecruiterNotificationEmail(emailSettings, applicationData, resumeLink) {
    try {
        // Get the job title from the jobs collection using the preferredRole ID
        let jobTitle = 'N/A';
        if (applicationData.preferredRole) {
            try {
                const jobDoc = await admin.firestore().collection('jobs').doc(applicationData.preferredRole).get();
                if (jobDoc.exists) {
                    const jobData = jobDoc.data();
                    jobTitle = (jobData === null || jobData === void 0 ? void 0 : jobData.title) || 'N/A';
                }
                else {
                    console.log(`Job with ID ${applicationData.preferredRole} not found`);
                }
            }
            catch (error) {
                console.error('Error fetching job details:', error);
            }
        }
        // Extract UTM parameters from application data
        const utmParams = {
            utm_source: applicationData.utm_source || 'N/A',
            utm_medium: applicationData.utm_medium || 'N/A',
            utm_campaign: applicationData.utm_campaign || 'N/A',
            utm_term: applicationData.utm_term || 'N/A',
            utm_content: applicationData.utm_content || 'N/A'
        };
        const data = await resend.emails.send({
            from: 'no-reply@bordertire.com',
            to: emailSettings.to,
            cc: emailSettings.cc.length > 0 ? emailSettings.cc : undefined,
            bcc: emailSettings.bcc.length > 0 ? emailSettings.bcc : undefined,
            subject: 'New Job Application Received',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Job Application</h2>
          <p>You've received a new application. Here are the details:</p>
          
          <p><strong>Availability</strong>: ${applicationData.availability || 'N/A'}</p>
          <p><strong>Email</strong>: ${applicationData.email || 'N/A'}</p>
          <p><strong>Emails Sent</strong>: ${applicationData.emailsSent || 'false'}</p>
          <p><strong>Experience</strong>: ${applicationData.experience || 'N/A'}</p>
          <p><strong>Full Name</strong>: ${applicationData.fullName || 'N/A'}</p>
          <p><strong>Phone</strong>: ${applicationData.phone || 'N/A'}</p>
          <p><strong>Preferred Role</strong>: ${jobTitle}</p>
          <p><strong>Resume:</strong> <a href="${resumeLink}" target="_blank">View Resume</a></p>
          
          <h3 style="color: #333; margin-top: 20px;">Marketing Source Information</h3>
          <p><strong>Source</strong>: ${utmParams.utm_source}</p>
          <p><strong>Medium</strong>: ${utmParams.utm_medium}</p>
          <p><strong>Campaign</strong>: ${utmParams.utm_campaign}</p>
          <p><strong>Term</strong>: ${utmParams.utm_term}</p>
          <p><strong>Content</strong>: ${utmParams.utm_content}</p>
          
          <p>Please review this application at your earliest convenience.</p>
        </div>
      `,
        });
        return data;
    }
    catch (error) {
        console.error('Error sending recruiter notification email:', error);
        throw error;
    }
}
// HTTP endpoint for testing the email functionality
exports.testEmail = functions.https.onRequest(async (req, res) => {
    try {
        // Only allow POST requests
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }
        const { email, name } = req.body;
        if (!email || !name) {
            res.status(400).send('Email and name are required');
            return;
        }
        const result = await sendApplicantConfirmationEmail(email, name);
        res.status(200).send({ success: true, result });
    }
    catch (error) {
        console.error('Error in test email endpoint:', error);
        res.status(500).send({ error: error.message });
    }
});
//# sourceMappingURL=index.js.map