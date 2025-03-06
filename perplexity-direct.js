#!/usr/bin/env node

const axios = require('axios');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Perplexity API key
const apiKey = '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';

// Function to call Perplexity API
async function callPerplexityAPI(prompt, model = 'sonar') {
  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Perplexity API:');
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    return 'Error: Failed to get response from Perplexity API';
  }
}

// Function to handle search queries
async function search(query, detailLevel = 'normal') {
  let prompt = query;
  
  switch (detailLevel) {
    case 'brief':
      prompt = `Provide a brief, concise answer to: ${query}`;
      break;
    case 'detailed':
      prompt = `Provide a comprehensive, detailed analysis of: ${query}. Include relevant examples, context, and supporting information where applicable.`;
      break;
    default:
      prompt = `Provide a clear, balanced answer to: ${query}. Include key points and relevant context.`;
  }
  
  const result = await callPerplexityAPI(prompt);
  console.log('\nPerplexity Response:');
  console.log('-------------------');
  console.log(result);
  console.log('-------------------\n');
}

// Function to get documentation
async function getDocumentation(query, context = '') {
  const prompt = `Provide comprehensive documentation and usage examples for ${query}. ${context ? `Focus on: ${context}` : ""} Include:
  1. Basic overview and purpose
  2. Key features and capabilities
  3. Installation/setup if applicable
  4. Common usage examples
  5. Best practices
  6. Common pitfalls to avoid
  7. Links to official documentation if available`;
  
  const result = await callPerplexityAPI(prompt);
  console.log('\nPerplexity Documentation:');
  console.log('------------------------');
  console.log(result);
  console.log('------------------------\n');
}

// Function to find APIs
async function findAPIs(requirement, context = '') {
  const prompt = `Find and evaluate APIs that could be used for: ${requirement}. ${context ? `Context: ${context}` : ""} For each API, provide:
  1. Name and brief description
  2. Key features and capabilities
  3. Pricing model (if available)
  4. Integration complexity
  5. Documentation quality
  6. Community support and popularity
  7. Any potential limitations or concerns
  8. Code example of basic usage`;
  
  const result = await callPerplexityAPI(prompt);
  console.log('\nPerplexity API Recommendations:');
  console.log('------------------------------');
  console.log(result);
  console.log('------------------------------\n');
}

// Function to check deprecated code
async function checkDeprecatedCode(code, technology = '') {
  const prompt = `Analyze this code for deprecated features or patterns${technology ? ` in ${technology}` : ""}:

  ${code}

  Please provide:
  1. Identification of any deprecated features, methods, or patterns
  2. Current recommended alternatives
  3. Migration steps if applicable
  4. Impact of the deprecation
  5. Timeline of deprecation if known
  6. Code examples showing how to update to current best practices`;
  
  const result = await callPerplexityAPI(prompt);
  console.log('\nPerplexity Code Analysis:');
  console.log('------------------------');
  console.log(result);
  console.log('------------------------\n');
}

// Main menu function
function showMainMenu() {
  console.log('\nPerplexity Direct - Choose an option:');
  console.log('1. Search');
  console.log('2. Get Documentation');
  console.log('3. Find APIs');
  console.log('4. Check Deprecated Code');
  console.log('5. Exit');
  
  rl.question('Enter your choice (1-5): ', async (choice) => {
    switch (choice) {
      case '1':
        rl.question('Enter your search query: ', (query) => {
          rl.question('Detail level (brief/normal/detailed) [normal]: ', async (detailLevel) => {
            const level = detailLevel.trim() || 'normal';
            await search(query, level);
            showMainMenu();
          });
        });
        break;
        
      case '2':
        rl.question('Enter technology/library to get documentation for: ', (query) => {
          rl.question('Additional context (optional): ', async (context) => {
            await getDocumentation(query, context);
            showMainMenu();
          });
        });
        break;
        
      case '3':
        rl.question('Enter functionality requirement: ', (requirement) => {
          rl.question('Additional project context (optional): ', async (context) => {
            await findAPIs(requirement, context);
            showMainMenu();
          });
        });
        break;
        
      case '4':
        console.log('Enter code to check (end with a line containing only "END"):');
        let code = '';
        const codeListener = (line) => {
          if (line === 'END') {
            rl.removeListener('line', codeListener);
            rl.question('Technology context (e.g., React, Node.js) [optional]: ', async (technology) => {
              await checkDeprecatedCode(code, technology);
              showMainMenu();
            });
          } else {
            code += line + '\n';
          }
        };
        rl.on('line', codeListener);
        break;
        
      case '5':
        console.log('Exiting Perplexity Direct. Goodbye!');
        rl.close();
        break;
        
      default:
        console.log('Invalid choice. Please try again.');
        showMainMenu();
    }
  });
}

// Start the application
console.log('Welcome to Perplexity Direct!');
console.log('This script allows you to interact directly with the Perplexity API.');
showMainMenu();

// Handle exit
rl.on('close', () => {
  process.exit(0);
});
