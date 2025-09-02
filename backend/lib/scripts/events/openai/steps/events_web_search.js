const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../../../.env') });

/**
 * Make HTTP request to OpenAI Responses API
 * @param {Object} data - Request data
 * @returns {Promise<Object>} Response data
 */
function makeOpenAIRequest(data) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/responses',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${apiKey}`
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(new Error(`API Error: ${res.statusCode} - ${parsedData.error?.message || responseData}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Read prompt from file and replace placeholders
 * @returns {string} Processed prompt
 */
function loadPrompt() {
  const promptPath = path.join(__dirname, 'prompts', 'events_web_search.txt');
  console.log(`📄 Loading prompt from: ${promptPath}`);
  try {
    const promptTemplate = fs.readFileSync(promptPath, 'utf8');
    console.log(`✅ Prompt loaded successfully (${promptTemplate.length} characters)`);
    
    // Calculate dates
    const today = new Date();
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    
    const todayStr = today.toISOString().split('T')[0];
    const twoMonthsAgoStr = twoMonthsAgo.toISOString().split('T')[0];
    
    // Replace placeholders
    const prompt = promptTemplate
      .replace('{START_DATE}', twoMonthsAgoStr)
      .replace('{END_DATE}', todayStr);
    
    return { prompt, todayStr, twoMonthsAgoStr };
  } catch (error) {
    throw new Error(`Failed to load prompt file: ${error.message}`);
  }
}

/**
 * Search for NYC events using web search
 * @returns {Promise<string>} Text content from web search
 */
async function searchForNYCEvents() {
  // Load and process the prompt
  const { prompt: searchQuery, todayStr, twoMonthsAgoStr } = loadPrompt();
  
  const requestData = {
    model: "gpt-4.1",
    tools: [
      {
        type: "web_search"
      }
    ],
    input: searchQuery,
    max_output_tokens: 3000
  };

  console.log(`🔍 Web Search Started: Searching for NYC events between ${twoMonthsAgoStr} and ${todayStr}...`);
  
  try {
    const response = await makeOpenAIRequest(requestData);
    console.log('✅ Web Search Completed successfully');
    
    // Log the full response for inspection
    console.log('\n🔍 Full API Response:');
    console.log('=' .repeat(60));
    console.log(JSON.stringify(response, null, 2));
    console.log('=' .repeat(60));
    console.log();
    
    // Extract text content from the response
    let textContent = '';
    
    // Check for output_text directly (some models provide this)
    if (response.output_text) {
      textContent = response.output_text;
    } else if (response.output && response.output.length > 0) {
      // First collect all web search queries performed
      const searchQueries = [];
      let hasMessage = false;
      
      for (const item of response.output) {
        if (item.type === 'web_search_call' && item.action && item.action.query) {
          searchQueries.push(item.action.query);
        }
        if (item.type === 'message' && item.content) {
          hasMessage = true;
          for (const content of item.content) {
            if (content.type === 'output_text') {
              textContent += content.text;
            }
          }
        }
      }
      
      // If no message content but we have search queries, create a summary
      if (!textContent && searchQueries.length > 0) {
        console.log('⚠️  No message content found, but detected web searches for:', searchQueries);
        // For now, we'll create a placeholder with the searches performed
        textContent = `Web searches were performed for the following queries:\n\n`;
        searchQueries.forEach((query, index) => {
          textContent += `${index + 1}. ${query}\n`;
        });
        textContent += `\nNote: The model performed web searches but did not return summarized results. This may be due to the model's response format. Please try running the script again or use a different model.`;
      }
    }
    
    if (!textContent) {
      throw new Error('No text content found in web search response');
    }
    
    return textContent;
  } catch (error) {
    console.error('❌ Web Search Failed:', error.message);
    throw error;
  }
}

/**
 * Save search results to text file
 * @param {string} content - Text content to save
 * @returns {string} Path to saved file
 */
function saveSearchResults(content) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `nyc_events_search_${timestamp}.txt`;
  const dirPath = path.join(__dirname, '../outputs');  // Save in outputs directory
  const filepath = path.join(dirPath, filename);
  
  // Create events directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  try {
    fs.writeFileSync(filepath, content);
    return filepath;
  } catch (error) {
    throw new Error(`Failed to save file: ${error.message}`);
  }
}

/**
 * Main function to search and save NYC events
 */
async function main() {
  try {
    console.log('🗽 NYC Events Web Search');
    console.log('=' .repeat(60));
    console.log();
    
    // Search for NYC events
    const searchResults = await searchForNYCEvents();
    
    // Save to file
    const savedPath = saveSearchResults(searchResults);
    
    console.log('\n📊 Search Results Summary:');
    console.log('=' .repeat(60));
    console.log(`📝 Content length: ${searchResults.length} characters`);
    console.log(`💾 Results saved to: ${savedPath}`);
    console.log('\n✨ Web search completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { searchForNYCEvents, saveSearchResults };
