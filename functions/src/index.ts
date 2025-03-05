import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Resend } from 'resend';
import { createEmailSettings } from './createEmailSettings';
import axios from 'axios';
import * as xml2js from 'xml2js';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Resend with API key from environment variables
const resend = new Resend(functions.config().resend.api_key);

let emailSettingsCache: any = null;

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
  } else {
    // If email settings don't exist, create them with default values
    try {
      await emailSettingsRef.set(emailSettings);
      console.log('Created default email settings');
    } catch (error) {
      console.error('Error creating default email settings:', error);
    }
  }

  emailSettingsCache = emailSettings;
  return emailSettings;
}

// Create email settings document if it doesn't exist
createEmailSettings()
  .then(() => console.log('Email settings initialization complete'))
  .catch((error: any) => console.error('Email settings initialization failed:', error));

/**
 * Cloud Function triggered when a new job application is created in Firestore
 * Sends confirmation email to applicant and notification email to recruiter
 */
export const sendApplicationEmails = functions.firestore
  .document('jobApplications/{applicationId}')
  .onWrite(async (change: functions.Change<functions.firestore.DocumentSnapshot>, context: functions.EventContext) => {
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
      const applicantEmailResult = await sendApplicantConfirmationEmail(
        applicationData.email,
        applicationData.fullName
      );
      
      console.log('Confirmation email sent to applicant:', applicantEmailResult);

      // Get email settings from Firestore
      const emailSettings = await getEmailSettings();

      // Send notification email to the recruiter(s)
      sendRecruiterNotificationEmail(
        emailSettings,
        applicationData,
        resumeLink
      );

      // Get the job title from the jobs collection using the preferredRole ID
      let jobTitle = 'N/A';
      if (applicationData.preferredRole) {
        try {
          const jobDoc = await admin.firestore().collection('jobs').doc(applicationData.preferredRole).get();
          if (jobDoc.exists) {
            const jobData = jobDoc.data();
            jobTitle = jobData?.title || 'N/A';
          } else {
            console.log(`Job with ID ${applicationData.preferredRole} not found`);
          }
        } catch (error) {
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
    } catch (error: any) {
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
async function sendApplicantConfirmationEmail(to: string, name: string) {
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
  } catch (error: any) {
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
async function sendRecruiterNotificationEmail(
  emailSettings: { to: string[], cc: string[], bcc: string[] },
  applicationData: any,
  resumeLink: string
) {
  try {
    // Get the job title from the jobs collection using the preferredRole ID
    let jobTitle = 'N/A';
    if (applicationData.preferredRole) {
      try {
        const jobDoc = await admin.firestore().collection('jobs').doc(applicationData.preferredRole).get();
        if (jobDoc.exists) {
          const jobData = jobDoc.data();
          jobTitle = jobData?.title || 'N/A';
        } else {
          console.log(`Job with ID ${applicationData.preferredRole} not found`);
        }
      } catch (error) {
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
  } catch (error: any) {
    console.error('Error sending recruiter notification email:', error);
    throw error;
  }
}

/**
 * Cloud Function to update jobs from XML feed
 * Fetches job data from the XML feed and updates the Firestore database
 */
export const updateJobsFromXmlFeed = functions.pubsub
  .schedule('0 0 * * *') // Run at midnight every day (cron syntax)
  .timeZone('America/Denver') // Mountain Time
  .onRun(async (context) => {
    try {
      console.log('Starting job update from XML feed');
      
      // Fetch the XML feed
      const xmlFeedUrl = 'https://mvtholdings.jobs/feeds/indeed.xml';
      console.log(`Fetching XML feed from: ${xmlFeedUrl}`);
      
      const response = await axios.get(xmlFeedUrl);
      const xmlData = response.data;
      
      // Parse the XML data
      const parser = new xml2js.Parser({ explicitArray: false });
      const result = await parser.parseStringPromise(xmlData);
      
      // Get the jobs from the parsed XML
      // Note: Adjust the path based on the actual XML structure
      const xmlJobs = result.source?.job || [];
      const jobs = Array.isArray(xmlJobs) ? xmlJobs : [xmlJobs];
      
      console.log(`Found ${jobs.length} jobs in the XML feed`);
      
      // Get existing jobs from Firestore
      const jobsCollection = admin.firestore().collection('jobs');
      const existingJobsSnapshot = await jobsCollection.get();
      const existingJobs = existingJobsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Array<{
        id: string;
        title?: string;
        description?: string;
        requirements?: string;
        isActive?: boolean;
        location?: string;
        company?: string;
        jobType?: string;
        salary?: string;
        externalId?: string;
        lastUpdated?: any;
      }>;
      
      console.log(`Found ${existingJobs.length} existing jobs in Firestore`);
      
      // Track which jobs were updated
      const updatedJobIds = new Set<string>();
      
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
            location: `${xmlJob.city || ''}, ${xmlJob.state || ''}`.trim(),
            company: 'Border Tire',
            jobType: xmlJob.jobtype || '',
            salary: xmlJob.salary || '',
            externalId: xmlJob.referencenumber || xmlJob.id || '',
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          };
          
          // Look for an existing job with the same external ID or title
          let existingJob = existingJobs.find(job => 
            (job.externalId && job.externalId === jobData.externalId) || 
            (job.title === jobData.title)
          );
          
          if (existingJob) {
            // Update existing job
            console.log(`Updating existing job: ${jobData.title}`);
            await jobsCollection.doc(existingJob.id).update(jobData);
            updatedJobIds.add(existingJob.id);
          } else {
            // Add new job
            console.log(`Adding new job: ${jobData.title}`);
            const newJobRef = await jobsCollection.add(jobData);
            updatedJobIds.add(newJobRef.id);
          }
        } catch (jobError) {
          console.error(`Error processing job ${xmlJob.title || 'unknown'}:`, jobError);
          // Continue with the next job
        }
      }
      
      // Mark jobs not in the feed as inactive
      for (const existingJob of existingJobs) {
        if (!updatedJobIds.has(existingJob.id)) {
          console.log(`Marking job as inactive: ${existingJob.title}`);
          await jobsCollection.doc(existingJob.id).update({ 
            isActive: false,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
      
      console.log('Job update from XML feed completed successfully');
      return null;
    } catch (error) {
      console.error('Error updating jobs from XML feed:', error);
      return null;
    }
  });

// HTTP endpoint for marking all Border Tire jobs as active
export const markBorderTireJobsActive = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
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
    const updatePromises: Promise<any>[] = [];
    const updatedJobs: string[] = [];
    
    borderTireJobsSnapshot.forEach(doc => {
      const jobData = doc.data();
      console.log(`Job ID: ${doc.id}`);
      console.log(`Title: ${jobData.title}`);
      console.log(`Location: ${jobData.location || 'N/A'}`);
      console.log(`Current isActive status: ${jobData.isActive}`);
      
      // Only update if not already active
      if (jobData.isActive !== true) {
        console.log(`Marking job as active: ${jobData.title}`);
        updatePromises.push(
          jobsCollection.doc(doc.id).update({ 
            isActive: true,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          })
        );
        updatedJobs.push(jobData.title);
      } else {
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
    } else {
      console.log('All Border Tire jobs are already active.');
      res.status(200).send({ 
        success: true, 
        message: 'All Border Tire jobs are already active.'
      });
    }
  } catch (error: any) {
    console.error('Error marking Border Tire jobs as active:', error);
    res.status(500).send({ error: error.message });
  }
});

// Import CORS package
import cors from 'cors';

// Initialize CORS middleware with options
const corsHandler = cors({ origin: true });

// HTTP endpoint for manually triggering the job update function
export const manualUpdateJobs = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
  // Enable CORS using the cors middleware
  return corsHandler(req, res, async () => {
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
    
    const response = await axios.get(xmlFeedUrl);
    const xmlData = response.data;
    
    // Parse the XML data
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlData);
    
    // Get the jobs from the parsed XML
    const xmlJobs = result.source?.job || [];
    const jobs = Array.isArray(xmlJobs) ? xmlJobs : [xmlJobs];
    
    console.log(`Found ${jobs.length} jobs in the XML feed`);
    
    // Get existing jobs from Firestore
    const jobsCollection = admin.firestore().collection('jobs');
    const existingJobsSnapshot = await jobsCollection.get();
    const existingJobs = existingJobsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Array<{
      id: string;
      title?: string;
      description?: string;
      requirements?: string;
      isActive?: boolean;
      location?: string;
      company?: string;
      jobType?: string;
      salary?: string;
      externalId?: string;
      lastUpdated?: any;
    }>;
    
    console.log(`Found ${existingJobs.length} existing jobs in Firestore`);
    
    // Track which jobs were updated
    const updatedJobIds = new Set<string>();
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
          location: `${xmlJob.city || ''}, ${xmlJob.state || ''}`.trim(),
          company: 'Border Tire',
          jobType: xmlJob.jobtype || '',
          salary: xmlJob.salary || '',
          externalId: xmlJob.referencenumber || xmlJob.id || '',
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        };
        
        // Debug logging to see what we're trying to match
        console.log(`Trying to match job: ${jobData.title} (externalId: ${jobData.externalId})`);
        
        // Look for an existing job with the same external ID, title, or similar title
        let existingJob = existingJobs.find(job => {
          // Debug logging for each existing job
          console.log(`Comparing with existing job: ${job.title} (externalId: ${job.externalId || 'none'})`);
          
          // Check if externalId matches (if both exist)
          const externalIdMatch = job.externalId && jobData.externalId && 
                                 job.externalId.toString() === jobData.externalId.toString();
          
          // Check if title matches exactly (case-insensitive)
          const exactTitleMatch = job.title && jobData.title && 
                                 job.title.toLowerCase().trim() === jobData.title.toLowerCase().trim();
          
          // Check if title is similar (contains or is contained by)
          const similarTitleMatch = job.title && jobData.title && (
                                   job.title.toLowerCase().includes(jobData.title.toLowerCase()) ||
                                   jobData.title.toLowerCase().includes(job.title.toLowerCase())
                                 );
          
          // Check if location matches (if both exist)
          const locationMatch = job.location && jobData.location && 
                               job.location.toLowerCase().trim() === jobData.location.toLowerCase().trim();
          
          // Log the match result
          if (externalIdMatch) console.log(`  - externalId match found for ${job.title}`);
          if (exactTitleMatch) console.log(`  - exact title match found for ${job.title}`);
          if (similarTitleMatch && !exactTitleMatch) console.log(`  - similar title match found for ${job.title}`);
          if (locationMatch) console.log(`  - location match found for ${job.title}`);
          
          // Match if any of the conditions are true
          return externalIdMatch || exactTitleMatch || 
                (similarTitleMatch && locationMatch) || // Only use similar title if location also matches
                (job.company === 'Border Tire' && similarTitleMatch); // Or if it's a Border Tire job with similar title
        });
        
        if (existingJob) {
          // Update existing job
          console.log(`Updating existing job: ${jobData.title}`);
          await jobsCollection.doc(existingJob.id).update(jobData);
          updatedJobIds.add(existingJob.id);
          jobsUpdated.push(jobData.title);
        } else {
          // Add new job
          console.log(`Adding new job: ${jobData.title}`);
          const newJobRef = await jobsCollection.add(jobData);
          updatedJobIds.add(newJobRef.id);
          jobsAdded.push(jobData.title);
        }
      } catch (jobError) {
        console.error(`Error processing job ${xmlJob.title || 'unknown'}:`, jobError);
        // Continue with the next job
      }
    }
    
    // Log all jobs that were updated
    console.log('Jobs that were updated:');
    updatedJobIds.forEach(id => {
      const job = existingJobs.find(j => j.id === id);
      if (job) console.log(`  - ${job.title} (${id})`);
    });
    
    // Log all existing jobs that weren't updated
    console.log('Existing jobs that were not updated:');
    existingJobs.forEach(job => {
      if (!updatedJobIds.has(job.id)) {
        console.log(`  - ${job.title} (${job.id}), externalId: ${job.externalId || 'none'}`);
      }
    });
    
    // Mark jobs not in the feed as inactive, but ONLY if they're not Border Tire jobs
    // This prevents Border Tire jobs from being incorrectly marked as inactive
    for (const existingJob of existingJobs) {
      if (!updatedJobIds.has(existingJob.id) && existingJob.isActive !== false) {
        // Skip Border Tire jobs to prevent them from being marked inactive
        if (existingJob.company === 'Border Tire') {
          console.log(`Skipping Border Tire job to prevent marking as inactive: ${existingJob.title} (${existingJob.id})`);
          continue;
        }
        
        console.log(`Marking job as inactive: ${existingJob.title} (${existingJob.id}), externalId: ${existingJob.externalId || 'none'}`);
        await jobsCollection.doc(existingJob.id).update({ 
          isActive: false,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });
        jobsInactivated.push(existingJob.title);
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
    } catch (error: any) {
      console.error('Error in manual job update:', error);
      res.status(500).send({ error: error.message });
    }
  });
});

// HTTP endpoint for testing the email functionality
export const testEmail = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
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
  } catch (error: any) {
    console.error('Error in test email endpoint:', error);
    res.status(500).send({ error: error.message });
  }
});
