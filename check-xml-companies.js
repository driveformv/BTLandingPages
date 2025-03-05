const axios = require('axios');
const xml2js = require('xml2js');

async function checkXmlFeed() {
  try {
    console.log('Checking XML feed...');
    
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
    
    // Count jobs by company
    const companyCounts = {};
    const borderTireJobs = [];
    
    jobs.forEach(job => {
      const company = job.company || 'Unknown';
      companyCounts[company] = (companyCounts[company] || 0) + 1;
      
      // Collect Border Tire jobs
      if (company === 'Border Tire') {
        borderTireJobs.push({
          title: job.title || 'No title',
          referencenumber: job.referencenumber || job.id || 'None',
          location: `${job.city || ''}, ${job.state || ''}`.trim() || 'Unknown'
        });
      }
    });
    
    // Print summary
    console.log('\nJobs by company:');
    Object.entries(companyCounts).forEach(([company, count]) => {
      console.log(`  ${company}: ${count}`);
    });
    
    // Print Border Tire jobs
    console.log('\nBorder Tire jobs in XML feed:');
    borderTireJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title}`);
      console.log(`   Reference Number: ${job.referencenumber}`);
      console.log(`   Location: ${job.location}`);
    });
    
  } catch (error) {
    console.error('Error checking XML feed:', error);
  }
}

// Run the function
checkXmlFeed();
