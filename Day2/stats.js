#!/usr/bin/env node   
// this is SheBang line it tells OS that use node.js interpreter for this code

const fs = require('fs');
const path = require('path');
const os = require('os');  // this will give us information about OS like Memory, hostname
// it is helpful in metrics logging tools as it gives info about OS 
const { performance } = require('perf_hooks'); // it gives us high precision time = execution time of functions

// Parse CLI arguments
const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    if (!value) continue;
    if (key === '--lines') options.linesFile = value;
    if (key === '--words') options.wordsFile = value;
    if (key === '--chars') options.charsFile = value;
}

// Function to read file and measure stats
async function measureFile(filePath, type) {
    const start = performance.now();
    const startMem = process.memoryUsage().heapUsed / 1024 / 1024;

    const data = await fs.promises.readFile(filePath, 'utf-8');

    let count;
    if (type === 'lines') count = data.split('\n').length;
    if (type === 'words') count = data.split(/\s+/).filter(Boolean).length;
    if (type === 'chars') count = data.length;

    const end = performance.now();
    const endMem = process.memoryUsage().heapUsed / 1024 / 1024;

    return {
        type,
        count,
        executionTimesMS: Math.round(end - start),
        memoryMB: parseFloat((endMem - startMem).toFixed(2)),
        timestamp: new Date().toISOString()
    };
}

// Main function
async function main() {
    const tasks = [];

    if (options.linesFile)
        tasks.push(
            measureFile(options.linesFile, 'lines').then(r => ({ file: path.resolve(options.linesFile), result: r }))
        );

    if (options.wordsFile)
        tasks.push(
            measureFile(options.wordsFile, 'words').then(r => ({ file: path.resolve(options.wordsFile), result: r }))
        );

    if (options.charsFile)
        tasks.push(
            measureFile(options.charsFile, 'chars').then(r => ({ file: path.resolve(options.charsFile), result: r }))
        );

    const results = await Promise.all(tasks);

    // Logs folder and file path
    //const homeDir = os.homedir();
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, 'report.json');
    

    await fs.promises.mkdir(logDir, { recursive: true });

    // Read existing log file
    let existingData = {};
    try {
        const fileContent = await fs.promises.readFile(logFile, 'utf-8');
        existingData = fileContent.trim() ? JSON.parse(fileContent) : {};
    } catch (err) {
        existingData = {};
    }

    // Append new results with unique IDs
    results.forEach(({ file, result }) => {
        if (!existingData[file]) existingData[file] = {};

        // Unique ID per measurement
        const id = `${result.type}_${new Date().toISOString()}`;

        existingData[file][id] = result;
    });

    // Save updated log
    await fs.promises.writeFile(logFile, JSON.stringify(existingData, null, 2), 'utf-8');
    console.log(`Report updated in ${logFile}`);
}

// Execute main
main().catch(err => console.error(err));




//node stats.js --lines ./sample.txt --words ./sample.txt --chars ./sample.txt
// this is the cmd to run and get json file
