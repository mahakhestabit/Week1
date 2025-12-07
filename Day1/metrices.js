const fs = require('fs'); // node built-in file system moudle = writing, reading access
const path = require('path'); // built in node functions like path.join(),.. resolve()

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });  // recursive: true -> if in path any directory is missing then create that directory as well
}

// Create a new file for each run with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // safe for filenames
const logFile = path.join(logDir, `day1-symmetrics-${timestamp}.json`);

// Start with an empty array
fs.writeFileSync(logFile, '[]');

function logMetrics() {
  const metrics = {
    timestamp: new Date().toISOString(),
    cpuUsage: process.cpuUsage(),
    resourceUsage: process.resourceUsage(),
  };

  const data = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
  data.push(metrics);
  fs.writeFileSync(logFile, JSON.stringify(data, null, 2)); // pretty print
}

// Example main program
function main() {
  console.log('Running main program...');
  for (let i = 0; i < 1e7; i++) {} // simulate work
}

// Log metrics before and after main program
logMetrics(); // before
main();
logMetrics(); // after

console.log(`Metrics logged to ${logFile}`);
