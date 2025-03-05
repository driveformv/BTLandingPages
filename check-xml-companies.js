/**
 * Script to check the company field of all jobs in the XML feed
 */

const axios = require('axios');
const xml2js = require('xml2js');

// XML feed URL
const xmlFeedUrl = 'https://mvtholdings.jobs/feeds/indeed.xml';

async function checkXmlCompanies() {
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
    
    // Count jobs by company
    const companyCounts = {};
    
    jobs.forEach(job => {
      const company = job.company || 'Unknown';
      companyCounts[company] = (companyCounts[company] || 0) + 1;
    });
    
    console.log('\nJobs by company:');
    Object.entries(companyCounts).forEach(([company, count]) => {
      console.log(`${company}: ${count} jobs`);
    });
    
    // List all jobs with their company and title
    console.log('\nAll jobs:');
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. [${job.company || 'Unknown'}] ${job.title || 'No title'}`);
    });
    
  } catch (error) {
    console.error('Error checking XML companies:', error);
  }
}

// Run the check
checkXmlCompanies();
