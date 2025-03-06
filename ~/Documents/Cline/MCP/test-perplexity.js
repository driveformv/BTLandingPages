#!/usr/bin/env node

const axios = require('axios');

async function testPerplexityAPI() {
  const apiKey = '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';
  
  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar-small-online',
        messages: [
          {
            role: 'user',
            content: 'What are the best practices for React hooks?'
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
    
    console.log('API Response:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error calling Perplexity API:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testPerplexityAPI();
