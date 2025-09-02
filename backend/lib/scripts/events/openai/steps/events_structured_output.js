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
 * Read prompt file
 * @param {string} filename - Prompt filename
 * @returns {string} Prompt content
 */
function readPrompt(filename) {
  const promptPath = path.join(__dirname, 'prompts', filename);
  try {
    return fs.readFileSync(promptPath, 'utf8').trim();
  } catch (error) {
    throw new Error(`Failed to read prompt file: ${error.message}`);
  }
}

/**
 * Read schema file
 * @param {string} filename - Schema filename
 * @returns {Object} Schema object
 */
function readSchema(filename) {
  const schemaPath = path.join(__dirname, 'prompts', filename);
  try {
    const content = fs.readFileSync(schemaPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read schema file: ${error.message}`);
  }
}

/**
 * Process text content into structured events
 * @param {string} textContent - Text content to process
 * @param {string} startDate - Start date for the events period
 * @param {string} endDate - End date for the events period
 * @returns {Promise<Object>} Structured events data
 */
async function processToStructuredEvents(textContent, startDate, endDate) {
  // Load prompt and schema from files
  let prompt = readPrompt('events_structuring.txt');
  const schema = readSchema('events_schema.json');
  
  // Replace placeholders in prompt
  prompt = prompt.replace('{START_DATE}', startDate);
  prompt = prompt.replace('{END_DATE}', endDate);
  
  const requestData = {
    model: "gpt-4.1",
    input: [
      {
        role: "user",
        content: `${prompt}\n\nPlease extract from the following text:\n\n${textContent}`
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "nyc_events_list",
        schema: schema,
        strict: true
      }
    },
    max_output_tokens: 3000
  };

  console.log('🔄 Structured Output Processing Started...');
  
  try {
    const response = await makeOpenAIRequest(requestData);
    console.log('✅ Structured Output Processing Completed');
    
    // Parse the structured output
    if (response.output && response.output.length > 0) {
      for (const item of response.output) {
        if (item.type === 'message' && item.content) {
          for (const content of item.content) {
            if (content.type === 'output_text') {
              try {
                return JSON.parse(content.text);
              } catch (parseError) {
                console.error('❌ Failed to parse JSON:', parseError.message);
                console.error('Text content:', content.text);
                throw new Error(`Failed to parse structured output: ${parseError.message}`);
              }
            }
          }
        }
      }
    }
    
    throw new Error('No structured output found in response');
  } catch (error) {
    console.error('❌ Structured Output Failed:', error.message);
    throw error;
  }
}

/**
 * Read text file
 * @param {string} filepath - Path to text file
 * @returns {string} File content
 */
function readTextFile(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

/**
 * Save structured events to JSON file
 * @param {Object} eventsData - Structured events data
 * @returns {string} Path to saved file
 */
function saveStructuredEvents(eventsData) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `nyc_events_structured_${timestamp}.json`;
  const dirPath = path.join(__dirname, '../outputs');  // Save in outputs directory
  const filepath = path.join(dirPath, filename);
  
  // Create events directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  try {
    fs.writeFileSync(filepath, JSON.stringify(eventsData, null, 2));
    return filepath;
  } catch (error) {
    throw new Error(`Failed to save file: ${error.message}`);
  }
}

/**
 * Main function to process text file into structured events
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      console.log('Usage: node events_structured_output.js <text_file_path>');
      console.log('Example: node events_structured_output.js events/nyc_events_search.txt');
      console.log('       : node events_structured_output.js backend/lib/scripts/events/nyc_events_search_2025-09-02T16-25-58-546Z.txt');
      process.exit(1);
    }
    
    const inputFile = args[0];
    
    // Calculate dates
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2);
    
    // Format dates as readable strings
    const formatDate = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };
    
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    // Handle different path types
    let fullPath;
    if (path.isAbsolute(inputFile)) {
      fullPath = inputFile;
    } else if (inputFile.includes('backend/')) {
      // Path relative to project root
      fullPath = path.join(process.cwd(), inputFile);
    } else {
      // Path relative to current directory
      fullPath = path.join(__dirname, inputFile);
    }
    
    console.log('🗽 NYC Events Structured Output Processor');
    console.log('=' .repeat(60));
    console.log(`📄 Input file: ${fullPath}`);
    console.log(`📅 Period: ${startDateStr} to ${endDateStr} (today)`);
    console.log();
    
    // Read the text file
    const textContent = readTextFile(fullPath);
    console.log(`📝 Read ${textContent.length} characters from file`);
    
    // Process into structured format
    const structuredEvents = await processToStructuredEvents(textContent, startDateStr, endDateStr);
    
    // Save to file
    const savedPath = saveStructuredEvents(structuredEvents);
    
    // Display results
    console.log('\n📊 Structured Output - NYC Recent Events:');
    console.log('=' .repeat(60));
    
    if (structuredEvents.events && structuredEvents.events.length > 0) {
      console.log(`\nFound ${structuredEvents.events.length} events:\n`);
      
      structuredEvents.events.forEach((event, index) => {
        console.log(`${index + 1}. ${event.eventName}`);
        console.log(`   📅 Date: ${event.date}`);
        console.log(`   📍 Location: ${event.location}`);
        console.log(`   🎯 Type: ${event.eventType}`);
        console.log(`   📝 Description: ${event.description}`);
        console.log();
      });
    }
    
    console.log('=' .repeat(60));
    console.log(`💾 Structured events saved to: ${savedPath}`);
    console.log(`📅 Extraction date: ${structuredEvents.extractionDate}`);
    console.log('\n✨ Processing completed successfully!');
    
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

module.exports = { processToStructuredEvents, readTextFile, saveStructuredEvents, readPrompt, readSchema };
