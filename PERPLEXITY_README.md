# Perplexity Direct

This is a command-line tool that allows you to interact directly with the Perplexity AI API without requiring the MCP server setup.

## Features

The script provides access to the following Perplexity capabilities:

1. **Search** - Get answers to general questions with adjustable detail levels
2. **Documentation** - Get comprehensive documentation for technologies, libraries, or APIs
3. **API Discovery** - Find and evaluate APIs that could be integrated into your project
4. **Code Deprecation Check** - Check if code or dependencies might be using deprecated features

## Prerequisites

- Node.js installed
- Axios package installed (`npm install axios`)

## Usage

1. Make the script executable:
   ```
   chmod +x perplexity-direct.js
   ```

2. Run the script:
   ```
   node perplexity-direct.js
   ```

3. Choose from the menu options:
   - Option 1: Search - Ask any question and get a response from Perplexity
   - Option 2: Get Documentation - Get comprehensive documentation for a technology or library
   - Option 3: Find APIs - Discover APIs that match your requirements
   - Option 4: Check Deprecated Code - Analyze code for deprecated features
   - Option 5: Exit - Close the application

## Examples

### Search
Use this option to get answers to general questions. You can specify the detail level:
- brief: Short, concise answers
- normal: Balanced answers with key points (default)
- detailed: Comprehensive analysis with examples and context

### Get Documentation
Get detailed documentation for any technology, library, or API. You can optionally provide additional context to focus on specific aspects.

### Find APIs
Discover APIs that match your requirements. Perplexity will provide information about each API including features, pricing, integration complexity, and more.

### Check Deprecated Code
Analyze code for deprecated features or patterns. Perplexity will identify deprecated elements and suggest alternatives.

## API Key

The script uses a Perplexity API key that's embedded in the code. If you need to use your own API key, edit the `apiKey` variable in the script.

## Troubleshooting

If you encounter any issues:
1. Make sure you have Node.js installed
2. Ensure you've installed the axios package (`npm install axios`)
3. Check your internet connection
4. Verify that the API key is valid

## Notes

This script is a direct alternative to using the Perplexity MCP server. It provides the same core functionality but with a simpler setup and direct interaction through the command line.
