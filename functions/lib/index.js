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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmail = exports.manualUpdateJobs = exports.markBorderTireJobsActive = exports.updateJobsFromXmlFeed = exports.sendApplicationEmails = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const resend_1 = require("resend");
const createEmailSettings_1 = require("./createEmailSettings");
const axios_1 = __importDefault(require("axios"));
const xml2js = __importStar(require("xml2js"));
// Initialize Firebase Admin
admin.initializeApp();
// Initialize Resend with API key from environment variables
const resend = new resend_1.Resend(functions.config().resend.api_key);
let emailSettingsCache = null;
// Function to fetch email settings from Firestore and cache them
async function getEmailSettings() {
    if (emailSettingsCache) {
        console.log('Using cached email settings');
        return emailSettingsCache;
    }
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
    emailSettingsCache = emailSettings;
    return emailSettings;
}
// Create email settings document if it doesn't exist
(0, createEmailSettings_1.createEmailSettings)()
    .then(() => console.log('Email settings initialization complete'))
    .catch((error) => console.error('Email settings initialization failed:', error));
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
        const emailSettings = await getEmailSettings();
        // Send notification email to the recruiter(s)
        sendRecruiterNotificationEmail(emailSettings, applicationData, resumeLink);
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
        console.log('Notification email sent to recruiters:', data);
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
/**
 * Cloud Function to update jobs from XML feed
 * Fetches job data from the XML feed and updates the Firestore database
 */
exports.updateJobsFromXmlFeed = functions.pubsub
    .schedule('0 0 * * *') // Run at midnight every day (cron syntax)
    .timeZone('America/Denver') // Mountain Time
    .onRun(async (context) => {
    var _a;
    try {
        console.log('Starting job update from XML feed');
        // Fetch the XML feed
        const xmlFeedUrl = 'https://mvtholdings.jobs/feeds/indeed.xml';
        console.log(`Fetching XML feed from: ${xmlFeedUrl}`);
        const response = await axios_1.default.get(xmlFeedUrl);
        const xmlData = response.data;
        // Parse the XML data
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xmlData);
        // Get the jobs from the parsed XML
        // Note: Adjust the path based on the actual XML structure
        const xmlJobs = ((_a = result.source) === null || _a === void 0 ? void 0 : _a.job) || [];
        const jobs = Array.isArray(xmlJobs) ? xmlJobs : [xmlJobs];
        console.log(`Found ${jobs.length} jobs in the XML feed`);
        // Get existing jobs from Firestore
        const jobsCollection = admin.firestore().collection('jobs');
        const existingJobsSnapshot = await jobsCollection.get();
        const existingJobs = existingJobsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        console.log(`Found ${existingJobs.length} existing jobs in Firestore`);
        // Track which jobs were updated
        const updatedJobIds = new Set();
        // Get all Border Tire jobs from the XML feed
        const borderTireJobs = jobs.filter(job => job.company === 'Border Tire');
        console.log(`Found ${borderTireJobs.length} Border Tire jobs in the XML feed`);
        // Process each Border Tire job from the XML feed
        for (const xmlJob of borderTireJobs) {
            try {
                // Clean up HTML formatting in description
                let cleanDescription = xmlJob.description || '';
                // Fix common formatting issues
                cleanDescription = cleanDescription
                    // Fix spacing issues
                    .replace(/\s+/g, ' ')
                    // Fix spacing after commas
                    .replace(/,\s*/g, ', ')
                    // Fix spacing after periods
                    .replace(/\.\s*/g, '. ')
                    // Fix spacing after colons
                    .replace(/:\s*/g, ': ')
                    // Fix spacing after semicolons
                    .replace(/;\s*/g, '; ')
                    // Fix spacing after question marks
                    .replace(/\?\s*/g, '? ')
                    // Fix spacing after exclamation marks
                    .replace(/!\s*/g, '! ')
                    // Fix spacing around parentheses
                    .replace(/\(\s*/g, '(').replace(/\s*\)/g, ')')
                    // Fix spacing around brackets
                    .replace(/\[\s*/g, '[').replace(/\s*\]/g, ']')
                    // Fix spacing around braces
                    .replace(/\{\s*/g, '{').replace(/\s*\}/g, '}')
                    // Fix spacing around quotes
                    .replace(/"\s*/g, '"').replace(/\s*"/g, '"')
                    // Fix spacing around apostrophes
                    .replace(/'\s*/g, "'").replace(/\s*'/g, "'")
                    // Fix spacing around hyphens
                    .replace(/\s*-\s*/g, '-')
                    // Fix spacing around en dashes
                    .replace(/\s*–\s*/g, ' – ')
                    // Fix spacing around em dashes
                    .replace(/\s*—\s*/g, ' — ')
                    // Fix spacing around dollar signs
                    .replace(/\$\s*/g, '$')
                    // Fix spacing around percentage signs
                    .replace(/\s*%/g, '%')
                    // Fix spacing around plus signs
                    .replace(/\s*\+\s*/g, '+')
                    // Fix spacing around equals signs
                    .replace(/\s*=\s*/g, '=');
                // Extract job data from XML
                const jobData = {
                    title: xmlJob.title || '',
                    description: cleanDescription,
                    requirements: xmlJob.requirements || '',
                    isActive: true,
                    company: 'Border Tire',
                    jobType: xmlJob.jobtype || '',
                    city: xmlJob.city || '',
                    state: xmlJob.state || '',
                    postalcode: xmlJob.postalcode || '',
                    country: xmlJob.country || '',
                    salary: xmlJob.salary || '',
                    externalId: xmlJob.referencenumber || xmlJob.id || '',
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
                };
                // Look for an existing job with the same external ID only
                let existingJob = null;
                // First try to match by external ID (most reliable)
                if (jobData.externalId) {
                    existingJob = existingJobs.find(job => job.externalId && job.externalId.toString() === jobData.externalId.toString());
                    if (existingJob) {
                        console.log(`Found job match by externalId: ${jobData.externalId}`);
                    }
                }
                // If no match by external ID, try to match by title as fallback
                if (!existingJob && jobData.title) {
                    existingJob = existingJobs.find(job => job.title && job.title === jobData.title && job.company === 'Border Tire');
                    if (existingJob) {
                        console.log(`Found job match by title: ${jobData.title}`);
                    }
                }
                if (existingJob) {
                    // Update existing job
                    console.log(`Updating existing job: ${jobData.title}`);
                    await jobsCollection.doc(existingJob.id).update(jobData);
                    updatedJobIds.add(existingJob.id);
                }
                else {
                    // Add new job
                    console.log(`Adding new job: ${jobData.title}`);
                    const newJobRef = await jobsCollection.add(jobData);
                    updatedJobIds.add(newJobRef.id);
                }
            }
            catch (jobError) {
                console.error("Error processing job:", jobError);
                // Continue with the next job
            }
        }
        // Mark jobs not in the feed as inactive, but ONLY if they're not Border Tire jobs
        const jobsInactivated = [];
        for (const existingJob of existingJobs) {
            if (!updatedJobIds.has(existingJob.id) && existingJob.isActive !== false) {
                // Skip Border Tire jobs to prevent them from being marked inactive
                if (existingJob.company === 'Border Tire') {
                    console.log("Skipping Border Tire job to prevent marking as inactive:", existingJob.title || "unknown job", "(" + existingJob.id + ")");
                    continue;
                }
                console.log("Marking job as inactive:", existingJob.title || "unknown job", "(" + existingJob.id + ")", "externalId:", existingJob.externalId || 'none');
                await jobsCollection.doc(existingJob.id).update({
                    isActive: false,
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
                });
                jobsInactivated.push(existingJob.title || "unknown job");
            }
        }
        console.log('Job update from XML feed completed successfully');
        return null;
    }
    catch (error) {
        console.error('Error updating jobs from XML feed:', error);
        return null;
    }
});
// HTTP endpoint for marking all Border Tire jobs as active
exports.markBorderTireJobsActive = functions.https.onRequest(async (req, res) => {
    try {
        console.log('Manual request to mark Border Tire jobs as active');
        // Only allow POST requests
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }
        // Get all jobs from Firestore
        const jobsCollection = admin.firestore().collection('jobs');
        const borderTireJobsSnapshot = await jobsCollection.where('company', '==', 'Border Tire').get();
        if (borderTireJobsSnapshot.empty) {
            console.log('No Border Tire jobs found in Firestore.');
            res.status(404).send({ error: 'No Border Tire jobs found in Firestore.' });
            return;
        }
        console.log(`Found ${borderTireJobsSnapshot.size} Border Tire jobs in Firestore.`);
        // Update each Border Tire job to be active
        const updatePromises = [];
        const updatedJobs = [];
        borderTireJobsSnapshot.forEach(doc => {
            const jobData = doc.data();
            console.log(`Job ID: ${doc.id}`);
            console.log(`Title: ${jobData.title}`);
            console.log(`Location: ${jobData.location || 'N/A'}`);
            console.log(`Current isActive status: ${jobData.isActive}`);
            // Only update if not already active
            if (jobData.isActive !== true) {
                console.log(`Marking job as active: ${jobData.title}`);
                updatePromises.push(jobsCollection.doc(doc.id).update({
                    isActive: true,
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
                }));
                updatedJobs.push(jobData.title);
            }
            else {
                console.log(`Job already active: ${jobData.title}`);
            }
        });
        // Wait for all updates to complete
        if (updatePromises.length > 0) {
            await Promise.all(updatePromises);
            console.log(`Successfully marked ${updatePromises.length} Border Tire jobs as active.`);
            res.status(200).send({
                success: true,
                message: `Successfully marked ${updatePromises.length} Border Tire jobs as active.`,
                updatedJobs
            });
        }
        else {
            console.log('All Border Tire jobs are already active.');
            res.status(200).send({
                success: true,
                message: 'All Border Tire jobs are already active.'
            });
        }
    }
    catch (error) {
        console.error('Error marking Border Tire jobs as active:', error);
        res.status(500).send({ error: error.message });
    }
});
// Import CORS package
const cors_1 = __importDefault(require("cors"));
// Initialize CORS middleware with options
const corsHandler = (0, cors_1.default)({ origin: true });
// HTTP endpoint for manually triggering the job update function
exports.manualUpdateJobs = functions.https.onRequest(async (req, res) => {
    // Enable CORS using the cors middleware
    return corsHandler(req, res, async () => {
        var _a;
        try {
            console.log('Manual job update triggered');
            // Only allow POST requests
            if (req.method !== 'POST') {
                res.status(405).send('Method Not Allowed');
                return;
            }
            // Fetch the XML feed
            const xmlFeedUrl = 'https://mvtholdings.jobs/feeds/indeed.xml';
            console.log(`Fetching XML feed from: ${xmlFeedUrl}`);
            const response = await axios_1.default.get(xmlFeedUrl);
            const xmlData = response.data;
            // Parse the XML data
            const parser = new xml2js.Parser({ explicitArray: false });
            const result = await parser.parseStringPromise(xmlData);
            // Get the jobs from the parsed XML
            const xmlJobs = ((_a = result.source) === null || _a === void 0 ? void 0 : _a.job) || [];
            const jobs = Array.isArray(xmlJobs) ? xmlJobs : [xmlJobs];
            console.log(`Found ${jobs.length} jobs in the XML feed`);
            // Get existing jobs from Firestore
            const jobsCollection = admin.firestore().collection('jobs');
            const existingJobsSnapshot = await jobsCollection.get();
            const existingJobs = existingJobsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
            console.log(`Found ${existingJobs.length} existing jobs in Firestore`);
            // Track which jobs were updated
            const updatedJobIds = new Set();
            const jobsAdded = [];
            const jobsUpdated = [];
            const jobsInactivated = [];
            // Get all Border Tire jobs from the XML feed
            const borderTireJobs = jobs.filter(job => job.company === 'Border Tire');
            console.log(`Found ${borderTireJobs.length} Border Tire jobs in the XML feed`);
            // Process each Border Tire job from the XML feed
            for (const xmlJob of borderTireJobs) {
                try {
                    // Clean up HTML formatting in description
                    let cleanDescription = xmlJob.description || '';
                    // Fix common formatting issues
                    cleanDescription = cleanDescription
                        // Fix spacing issues
                        .replace(/\s+/g, ' ')
                        // Fix spacing after commas
                        .replace(/,\s*/g, ', ')
                        // Fix spacing after periods
                        .replace(/\.\s*/g, '. ')
                        // Fix spacing after colons
                        .replace(/:\s*/g, ': ')
                        // Fix spacing after semicolons
                        .replace(/;\s*/g, '; ')
                        // Fix spacing after question marks
                        .replace(/\?\s*/g, '? ')
                        // Fix spacing after exclamation marks
                        .replace(/!\s*/g, '! ')
                        // Fix spacing around parentheses
                        .replace(/\(\s*/g, '(').replace(/\s*\)/g, ')')
                        // Fix spacing around brackets
                        .replace(/\[\s*/g, '[').replace(/\s*\]/g, ']')
                        // Fix spacing around braces
                        .replace(/\{\s*/g, '{').replace(/\s*\}/g, '}')
                        // Fix spacing around quotes
                        .replace(/"\s*/g, '"').replace(/\s*"/g, '"')
                        // Fix spacing around apostrophes
                        .replace(/'\s*/g, "'").replace(/\s*'/g, "'")
                        // Fix spacing around hyphens
                        .replace(/\s*-\s*/g, '-')
                        // Fix spacing around en dashes
                        .replace(/\s*–\s*/g, ' – ')
                        // Fix spacing around em dashes
                        .replace(/\s*—\s*/g, ' — ')
                        // Fix spacing around dollar signs
                        .replace(/\$\s*/g, '$')
                        // Fix spacing around percentage signs
                        .replace(/\s*%/g, '%')
                        // Fix spacing around plus signs
                        .replace(/\s*\+\s*/g, '+')
                        // Fix spacing around equals signs
                        .replace(/\s*=\s*/g, '=');
                    // Extract job data from XML
                    const jobData = {
                        title: xmlJob.title || '',
                        description: cleanDescription,
                        requirements: xmlJob.requirements || '',
                        isActive: true,
                        company: 'Border Tire',
                        jobType: xmlJob.jobtype || '',
                        city: xmlJob.city || '',
                        state: xmlJob.state || '',
                        postalcode: xmlJob.postalcode || '',
                        country: xmlJob.country || '',
                        salary: xmlJob.salary || '',
                        externalId: xmlJob.referencenumber || xmlJob.id || '',
                        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
                    };
                    // Debug logging to see what we're trying to match
                    console.log("Trying to match job:", jobData.title, "(externalId:", jobData.externalId, ")");
                    // Look for an existing job with the same external ID only
                    let existingJob = null;
                    for (const job of existingJobs) {
                        // Skip jobs without externalId
                        if (!job.externalId || !jobData.externalId)
                            continue;
                        // Check if externalId matches
                        if (job.externalId.toString() === jobData.externalId.toString()) {
                            console.log("Found matching job by externalId:", job.externalId);
                            existingJob = job;
                            break;
                        }
                    }
                    if (existingJob) {
                        // Update existing job
                        console.log(`Updating existing job: ${jobData.title}`);
                        await jobsCollection.doc(existingJob.id).update(jobData);
                        updatedJobIds.add(existingJob.id);
                        jobsUpdated.push(jobData.title);
                    }
                    else {
                        // Add new job
                        console.log(`Adding new job: ${jobData.title}`);
                        const newJobRef = await jobsCollection.add(jobData);
                        updatedJobIds.add(newJobRef.id);
                        jobsAdded.push(jobData.title);
                    }
                }
                catch (jobError) {
                    console.error("Error processing job:", jobError);
                    // Continue with the next job
                }
            }
            // Log all jobs that were updated
            console.log('Jobs that were updated:');
            updatedJobIds.forEach(id => {
                const job = existingJobs.find(j => j.id === id);
                if (job)
                    console.log("  -", job.title || "unknown job", "(" + id + ")");
            });
            // Log all existing jobs that weren't updated
            console.log('Existing jobs that were not updated:');
            existingJobs.forEach(job => {
                if (!updatedJobIds.has(job.id)) {
                    console.log("  -", job.title || "unknown job", "(" + job.id + ")", "externalId:", job.externalId || 'none');
                }
            });
            // Mark jobs not in the feed as inactive, but ONLY if they're not Border Tire jobs
            // This prevents Border Tire jobs from being incorrectly marked as inactive
            for (const existingJob of existingJobs) {
                if (!updatedJobIds.has(existingJob.id) && existingJob.isActive !== false) {
                    // Skip Border Tire jobs to prevent them from being marked inactive
                    if (existingJob.company === 'Border Tire') {
                        console.log("Skipping Border Tire job to prevent marking as inactive:", existingJob.title || "unknown job", "(" + existingJob.id + ")");
                        continue;
                    }
                    console.log("Marking job as inactive:", existingJob.title || "unknown job", "(" + existingJob.id + ")", "externalId:", existingJob.externalId || 'none');
                    await jobsCollection.doc(existingJob.id).update({
                        isActive: false,
                        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
                    });
                    jobsInactivated.push(existingJob.title || "unknown job");
                }
            }
            console.log('Manual job update completed successfully');
            // Return a summary of the changes
            res.status(200).send({
                success: true,
                summary: {
                    totalJobsInFeed: jobs.length,
                    totalExistingJobs: existingJobs.length,
                    jobsAdded,
                    jobsUpdated,
                    jobsInactivated,
                    addedCount: jobsAdded.length,
                    updatedCount: jobsUpdated.length,
                    inactivatedCount: jobsInactivated.length
                }
            });
        }
        catch (error) {
            console.error('Error in manual job update:', error);
            res.status(500).send({ error: error.message });
        }
    });
});
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