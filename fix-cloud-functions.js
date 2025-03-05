const fs = require('fs');
const path = require('path');

// Path to the Cloud Functions source file
const sourcePath = path.join(__dirname, 'functions', 'src', 'index.ts');

// Read the current content
console.log(`Reading file: ${sourcePath}`);
let content = fs.readFileSync(sourcePath, 'utf8');

// Make the fixes
console.log('Applying fixes to the code...');

// Fix 1: Update the job matching logic to use external ID only
const jobMatchingFix = `
// Look for an existing job with the same external ID only
let existingJob = null;
for (const job of existingJobs) {
  // Skip jobs without externalId
  if (!job.externalId || !jobData.externalId) continue;
  
  // Check if externalId matches
  if (job.externalId.toString() === jobData.externalId.toString()) {
    console.log("Found matching job by externalId:", job.externalId);
    existingJob = job;
    break;
  }
}`;

// Replace the existing job matching logic
content = content.replace(
  /\/\/ Look for an existing job with the same external ID or title[\s\S]*?let existingJob[\s\S]*?\);/g,
  jobMatchingFix
);

// Fix 2: Ensure Border Tire jobs are never marked as inactive
const skipBorderTireFix = `
        // Skip Border Tire jobs to prevent them from being marked inactive
        if (existingJob.company === 'Border Tire') {
          console.log("Skipping Border Tire job to prevent marking as inactive:", existingJob.title || "unknown job", "("+existingJob.id+")");
          continue;
        }`;

// Add the skip logic to both functions
content = content.replace(
  /\/\/ Mark jobs not in the feed as inactive[\s\S]*?for \(const existingJob of existingJobs\) {[\s\S]*?if \(!updatedJobIds\.has\(existingJob\.id\) && existingJob\.isActive !== false\) {/g,
  match => match + skipBorderTireFix
);

// Fix 3: Fix TypeScript errors by avoiding template literals with potentially undefined values
content = content.replace(
  /console\.log\(`(.*?)${(.*?)}`\)/g,
  (match, prefix, variable) => {
    // If the variable might be undefined, use string concatenation instead
    if (variable.includes('.title') || variable.includes('.externalId')) {
      return `console.log("${prefix}" + (${variable} || "unknown"))`;
    }
    return match;
  }
);

// Write the updated content back to the file
console.log(`Writing updated content to: ${sourcePath}`);
fs.writeFileSync(sourcePath, content, 'utf8');

console.log('Fixes applied successfully!');
console.log('Please rebuild the Cloud Functions to apply the changes:');
console.log('  cd functions && npm run build');
