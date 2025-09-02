const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

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
 * Get recent events in NYC using web search
 * @returns {Promise<Object>} Response with web search results
 */
async function searchForNYCEvents() {
  // Calculate dates
  const today = new Date();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(today.getMonth() - 2);
  
  const todayStr = today.toISOString().split('T')[0];
  const twoMonthsAgoStr = twoMonthsAgo.toISOString().split('T')[0];
  
  const searchQuery = `Find major events actively happening in New York City (NYC) between ${twoMonthsAgoStr} and ${todayStr}. Focus ONLY on events that are HAPPENING or TAKING PLACE (not ending/stopping/concluding). These must be events that gained at least regional interest and media coverage, such as: major sports tournaments (like US Open), iconic seasonal traditions (like Macy's fireworks), Fashion Week, major concert series, famous festivals, large conventions, celebrity events, or viral happenings. Think of events that tourists would plan trips around or that New Yorkers mark on their calendars. DO NOT include: closures, endings, outbreaks ending, or anything stopping. IMPORTANT: Quality over quantity - only include truly notable events. If there are only 3-5 events that meet these criteria, that's perfectly fine. Do not force it to 10.`;
  
  const requestData = {
    model: "gpt-4.1",
    tools: [
      {
        type: "web_search",
        user_location: {
          type: "approximate",
          country: "US",
          city: "New York",
          region: "New York"
        }
      }
    ],
    input: searchQuery,
    max_output_tokens: 2000
  };

  console.log(`🔍 Request 1 Started: Searching for NYC events between ${twoMonthsAgoStr} and ${todayStr}...`);
  
  try {
    const response = await makeOpenAIRequest(requestData);
    console.log('✅ Request 1 Completed: Web search finished successfully');
    return response;
  } catch (error) {
    console.error('❌ Request 1 Failed:', error.message);
    throw error;
  }
}

/**
 * Process web search results into structured JSON
 * @param {Object} searchResponse - Response from web search
 * @returns {Promise<Array>} Structured list of events
 */
async function processEventsToStructuredOutput(searchResponse) {
  // Extract the text content from the search response
  let searchContent = '';
  
  // Remove debug logging
  
  if (searchResponse.output && searchResponse.output.length > 0) {
    for (const item of searchResponse.output) {
      if (item.type === 'message' && item.content) {
        for (const content of item.content) {
          if (content.type === 'output_text') {
            searchContent += content.text;
          }
        }
      }
    }
  }
  
  if (!searchContent) {
    // Check for output_text directly
    if (searchResponse.output_text) {
      searchContent = searchResponse.output_text;
    } else {
      throw new Error('No content found in search response');
    }
  }
  
  const requestData = {
    model: "gpt-5",
    input: [
      {
        role: "system",
        content: "Extract a structured list of major NYC events that are ACTIVELY HAPPENING from the provided text. Focus only on events that gained at least regional interest - events that tourists would plan trips around or locals mark on calendars. Include ONLY active events (not endings/closures/conclusions). IMPORTANT: Event names must be 1-3 words maximum."
      },
      {
        role: "user",
        content: `Please extract the major NYC events that are HAPPENING (not ending) from the following text. Only include events with regional/national interest like US Open, Fashion Week, Macy's fireworks, major concerts, etc. IMPORTANT: Keep event names to 1-3 words only (e.g., "US Open", "Summer Streets", "Fashion Week"). Quality over quantity - if there are only 3-5 truly notable events, that's perfect. Do not pad the list:\n\n${searchContent}`
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "nyc_events_list",
        schema: {
          type: "object",
          properties: {
            events: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  eventName: {
                    type: "string",
                    description: "Name of the event (1-3 words maximum, e.g., 'US Open', 'Summer Streets')"
                  },
                  eventType: {
                    type: "string",
                    description: "Type of event (e.g., sports tournament, fashion week, music festival, seasonal tradition, major concert, convention, cultural festival, etc.)"
                  },
                  date: {
                    type: "string",
                    description: "Date when the event occurred (ISO format if possible)"
                  },
                  location: {
                    type: "string",
                    description: "Specific location in NYC where the event took place"
                  },
                  description: {
                    type: "string",
                    description: "Brief description of the event"
                  }
                },
                required: ["eventName", "eventType", "date", "location", "description"],
                additionalProperties: false
              },
              minItems: 1,
              maxItems: 10
            },
            extractionDate: {
              type: "string",
              description: "Date when this data was extracted"
            }
          },
          required: ["events", "extractionDate"],
          additionalProperties: false
        },
        strict: true
      }
    },
    max_output_tokens: 4000
  };

  console.log('🔄 Request 2 Started: Processing events into structured format...');
  
  try {
    const response = await makeOpenAIRequest(requestData);
    console.log('✅ Request 2 Completed: Events structured successfully');
    
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
                console.error('Raw text:', content.text.substring(0, 200) + '...');
                throw new Error(`Failed to parse structured output: ${parseError.message}`);
              }
            }
          }
        }
      }
    }
    
    // Check if response has output_text directly
    if (response.output_text) {
      try {
        return JSON.parse(response.output_text);
      } catch (parseError) {
        console.error('❌ Failed to parse output_text:', parseError.message);
        throw new Error(`Failed to parse output_text: ${parseError.message}`);
      }
    }
    
    throw new Error('No structured output found in response');
  } catch (error) {
    console.error('❌ Request 2 Failed:', error.message);
    throw error;
  }
}

/**
 * Save events to JSON file
 * @param {Object} eventsData - Structured events data
 * @returns {string} Path to saved file
 */
function saveEventsToFile(eventsData) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `nyc_events_${timestamp}.json`;
  const dirPath = path.join(__dirname, 'events');
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
 * Main function to get and process NYC events
 */
async function main() {
  try {
    console.log('🗽 NYC Recent Events Fetcher');
    console.log('=' .repeat(60));
    console.log();
    
    // Step 1: Search for NYC events
    const searchResponse = await searchForNYCEvents();
    
    // Step 2: Process into structured format
    const structuredEvents = await processEventsToStructuredOutput(searchResponse);
    
    // Step 3: Save to file
    const savedPath = saveEventsToFile(structuredEvents);
    
    // Step 4: Display results
    console.log('\n📊 Final Output - NYC Recent Events:');
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
    console.log(`💾 Events saved to: ${savedPath}`);
    console.log(`📅 Extraction date: ${structuredEvents.extractionDate}`);
    console.log('\n✨ Process completed successfully!');
    
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

module.exports = { searchForNYCEvents, processEventsToStructuredOutput, saveEventsToFile };
