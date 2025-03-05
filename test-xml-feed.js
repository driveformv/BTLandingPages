/**
 * Test script for XML feed parsing
 * 
 * This script fetches the XML feed from https://mvtholdings.jobs/feeds/indeed.xml,
 * parses it, and displays the job data. It's useful for testing the XML feed
 * structure and verifying that the job data can be extracted correctly.
 * 
 * Usage:
 * node test-xml-feed.js
 */

const axios = require('axios');
const xml2js = require('xml2js');

// XML feed URL
const xmlFeedUrl = 'https://mvtholdings.jobs/feeds/indeed.xml';

/**
 * Fetch and parse the XML feed
 */
async function testXmlFeed() {
  try {
    console.log(`Fetching XML feed from: ${xmlFeedUrl}`);
    
    // Fetch the XML feed
    const response = await axios.get(xmlFeedUrl);
    const xmlData = response.data;
    
    console.log('XML feed fetched successfully');
    console.log('Parsing XML data...');
    
    // Parse the XML data
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlData);
    
    // Get the jobs from the parsed XML
    const xmlJobs = result.source?.job || [];
    const jobs = Array.isArray(xmlJobs) ? xmlJobs : [xmlJobs];
    
    console.log(`Found ${jobs.length} total jobs in the XML feed`);
    
    // Filter for Border Tire jobs only
    const borderTireJobs = jobs.filter(job => job.company === 'Border Tire');
    console.log(`Found ${borderTireJobs.length} Border Tire jobs in the XML feed`);
    
    // Display the first Border Tire job as an example
    if (borderTireJobs.length > 0) {
      console.log('\nExample Border Tire job data:');
      console.log(JSON.stringify(borderTireJobs[0], null, 2));
      
      // Extract and display the fields we're interested in
      const jobFields = extractJobFields(borderTireJobs[0]);
      console.log('\nExtracted job fields:');
      console.log(JSON.stringify(jobFields, null, 2));
      
      // Clean up HTML formatting in description
      let cleanDescription = borderTireJobs[0].description || '';
      
      // Replace multiple spaces with a single space
      cleanDescription = cleanDescription.replace(/\s+/g, ' ');
      
      // Fix spacing after commas and periods
      cleanDescription = cleanDescription.replace(/,\s*/g, ', ').replace(/\.\s*/g, '. ');
      
      console.log('\nCleaned description:');
      console.log(cleanDescription);
    }
    
    // Display a summary of all Border Tire jobs
    console.log('\nBorder Tire Job Details:');
    borderTireJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title || 'No title'} (${job.city}, ${job.state})`);
      console.log(`   Reference Number: ${job.referencenumber || 'N/A'}`);
      console.log(`   ID: ${job.id || 'N/A'}`);
      console.log('-----------------------------------');
    });
    
    // Check for missing fields
    checkMissingFields(borderTireJobs);
    
  } catch (error) {
    console.error('Error testing XML feed:', error);
  }
}

/**
 * Extract the fields we're interested in from a job
 * @param {Object} job - The job object from the XML feed
 * @returns {Object} - The extracted job fields
 */
function extractJobFields(job) {
  return {
    title: job.title || '',
    description: job.description || '',
    requirements: job.requirements || '',
    location: job.location || '',
    company: job.company || 'Border Tire',
    jobType: job.jobtype || '',
    salary: job.salary || '',
    externalId: job.referencenumber || job.id || '',
  };
}

/**
 * Check for missing fields in the jobs
 * @param {Array} jobs - The jobs from the XML feed
 */
function checkMissingFields(jobs) {
  console.log('\nChecking for missing fields...');
  
  const requiredFields = ['title', 'description'];
  const optionalFields = ['requirements', 'location', 'company', 'jobtype', 'salary', 'referencenumber', 'id'];
  
  const missingRequiredFields = {};
  const missingOptionalFields = {};
  
  jobs.forEach((job, index) => {
    const jobTitle = job.title || `Job ${index + 1}`;
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!job[field]) {
        if (!missingRequiredFields[field]) {
          missingRequiredFields[field] = [];
        }
        missingRequiredFields[field].push(jobTitle);
      }
    });
    
    // Check optional fields
    optionalFields.forEach(field => {
      if (!job[field]) {
        if (!missingOptionalFields[field]) {
          missingOptionalFields[field] = [];
        }
        missingOptionalFields[field].push(jobTitle);
      }
    });
  });
  
  // Display missing required fields
  if (Object.keys(missingRequiredFields).length > 0) {
    console.log('\nMissing required fields:');
    for (const [field, jobTitles] of Object.entries(missingRequiredFields)) {
      console.log(`- ${field}: ${jobTitles.length} jobs (${jobTitles.join(', ')})`);
    }
  } else {
    console.log('\nAll required fields are present in all jobs.');
  }
  
  // Display missing optional fields
  console.log('\nMissing optional fields:');
  for (const [field, jobTitles] of Object.entries(missingOptionalFields)) {
    console.log(`- ${field}: ${jobTitles.length} jobs`);
  }
}

// Run the test
testXmlFeed();
