const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Find the most recently created file matching a pattern
 * @param {string} pattern - Glob pattern to match files
 * @param {string} directory - Directory to search in
 * @returns {string|null} Path to the most recent file or null if not found
 */
function findLatestFile(pattern, directory) {
  const files = glob.sync(path.join(directory, pattern));
  if (files.length === 0) {
    return null;
  }
  
  // Sort by modification time, newest first
  files.sort((a, b) => {
    const statA = fs.statSync(a);
    const statB = fs.statSync(b);
    return statB.mtime.getTime() - statA.mtime.getTime();
  });
  
  return files[0];
}

/**
 * Run a Node.js script and capture output
 * @param {string} scriptPath - Path to the script
 * @param {Array} args - Arguments to pass to the script
 * @returns {Promise<void>}
 */
function runNodeScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath, ...args], {
      cwd: process.cwd(),
      env: process.env
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      process.stdout.write(output);
    });

    child.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      process.stderr.write(output);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Script exited with code ${code}\n${stderr}`));
      } else {
        resolve({ stdout, stderr });
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Run the web search script to find NYC events
 * @returns {Promise<string>} Path to the generated search results file
 */
async function runWebSearch() {
  console.log('🔍 Step 1: Running NYC Events Web Search...');
  console.log('='.repeat(60));
  
  const scriptPath = path.join(__dirname, 'steps', 'events_web_search.js');
  const outputDir = path.join(__dirname, 'outputs');
  
  try {
    await runNodeScript(scriptPath);
    
    // Find the generated search results file
    const searchResultsFile = findLatestFile('nyc_events_search_*.txt', outputDir);
    
    if (!searchResultsFile) {
      throw new Error('Could not find generated search results file');
    }
    
    console.log(`✅ Search results saved to: ${searchResultsFile}`);
    return searchResultsFile;
    
  } catch (error) {
    console.error('❌ Web search failed:', error.message);
    throw error;
  }
}

/**
 * Run the structured output script to process search results
 * @param {string} searchResultsFile - Path to the search results file
 * @returns {Promise<string>} Path to the generated structured JSON file
 */
async function runStructuredOutput(searchResultsFile) {
  console.log('\n📊 Step 2: Processing to Structured Output...');
  console.log('='.repeat(60));
  
  const scriptPath = path.join(__dirname, 'steps', 'events_structured_output.js');
  const outputDir = path.join(__dirname, 'outputs');
  
  try {
    await runNodeScript(scriptPath, [searchResultsFile]);
    
    // Find the generated structured JSON file
    const structuredJsonFile = findLatestFile('nyc_events_structured_*.json', outputDir);
    
    if (!structuredJsonFile) {
      throw new Error('Could not find generated structured JSON file');
    }
    
    return structuredJsonFile;
    
  } catch (error) {
    console.error('❌ Structured output processing failed:', error.message);
    throw error;
  }
}

/**
 * Main orchestration function
 */
async function main() {
  console.log('🗽 NYC Events Processing Orchestrator');
  console.log('='.repeat(60));
  console.log(`📅 Starting at: ${new Date().toLocaleString()}`);
  console.log();
  
  try {
    // Ensure outputs directory exists
    const outputsDir = path.join(__dirname, 'outputs');
    if (!fs.existsSync(outputsDir)) {
      fs.mkdirSync(outputsDir, { recursive: true });
    }
    
    // Step 1: Run web search
    const searchResultsFile = await runWebSearch();
    
    // Step 2: Process to structured output
    const structuredJsonFile = await runStructuredOutput(searchResultsFile);
    
    // Display final results
    console.log('\n✨ NYC Events Processing Complete!');
    console.log('='.repeat(60));
    console.log(`📄 Search results: ${searchResultsFile}`);
    console.log(`📊 Structured JSON: ${structuredJsonFile}`);
    
    // Load and display summary of events
    try {
      const eventsData = JSON.parse(fs.readFileSync(structuredJsonFile, 'utf8'));
      
      if (eventsData.events) {
        console.log(`\n📌 Found ${eventsData.events.length} events:`);
        eventsData.events.forEach((event, i) => {
          console.log(`   ${i + 1}. ${event.eventName || 'Unknown'} - ${event.date || 'No date'}`);
        });
      }
    } catch (error) {
      console.warn('\n⚠️  Could not read events summary:', error.message);
    }
    
    console.log(`\n🎯 Final output: ${structuredJsonFile}`);
    console.log(`📅 Completed at: ${new Date().toLocaleString()}`);
    
    return structuredJsonFile;
    
  } catch (error) {
    console.error('\n💥 Orchestration failed:', error.message);
    process.exit(1);
  }
}

// Run the orchestrator if called directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { main };
