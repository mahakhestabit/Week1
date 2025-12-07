const { spawn } = require("child_process");

function runCommand(description, command, args = []) {
    return new Promise((resolve) => {
        // it will print the description which received from the function call
        console.log(`\n----- ${description} -----`);

        // we have to make shell command true because it will help us to run the pipe commands
        const cmd = spawn(command, args, { shell: true });

        // it will print the output to the terminal
        cmd.stdout.on("data", (data) => {
            process.stdout.write(data.toString());
        });

        // this is written to print and handle the errors during the command 
        cmd.stderr.on("data", (data) => {
            process.stderr.write(`Error: ${data.toString()}`);
        });

        // it will close once the promise will be fullfilled
        cmd.on("close", () => {
            resolve();
        });
    });
}

async function main() {
    await runCommand("Host Name", "hostname");
    await runCommand("Available Disk Space", "df", ["-h"]);
    await runCommand("Top 5 Open Ports", "ss", ["-tulpn"]);
    await runCommand("Default Gateway", "ip", ["route", "show", "default"]);
    await runCommand("Logged-in Users Count", "who | wc -l");  // pipe handled via shell
}

main();






// without asyn and await

// #!/usr/bin/env node

// const { execSync } = require("child_process");

// // Helper to run shell commands safely
// function run(cmd) {
//   try {
//     return execSync(cmd, { encoding: "utf8" }).trim();
//   } catch {
//     return "N/A";
//   }
// }

// console.log("=== System Information (Linux) ===");

// const hostname = run("hostname");
// console.log("Hostname:", hostname);

// const diskFree = run("df -h / | awk 'NR==2 {print $4}'");
// console.log("Available Disk Space (/):", diskFree);

// const openPorts = run(
//   `ss -tuln | tail -n +2 | awk '{print $5}' | sed 's/.*://' | grep -E '^[0-9]+$' | sort -n | uniq -c | sort -nr | head -5`
// );
// console.log("Top 5 Open Ports:\n" + openPorts);

// const gateway = run("ip route | awk '/default/ {print $3}'");
// console.log("Default Gateway:", gateway);


// const userCount = run("who | wc -l");
// console.log("Logged-in Users:", userCount);
