/**
 * Pre-start script to kill any process on port 4000
 * This runs automatically before starting the server
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function killPort(port = 4000) {
  try {
    const { stdout } = await execAsync(`netstat -ano | findstr :${port} | findstr LISTENING`);
    
    if (!stdout || stdout.trim() === '') {
      return; // Port is free
    }
    
    const lines = stdout.trim().split('\n');
    const pids = new Set();
    
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(pid)) {
        pids.add(pid);
      }
    }
    
    for (const pid of pids) {
      try {
        await execAsync(`taskkill /F /PID ${pid}`);
      } catch (error) {
        // Process might already be dead, ignore
      }
    }
    
    // Wait a bit for port to be released
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    // Port is likely free or command failed, continue anyway
  }
}

killPort(4000).then(() => {
  process.exit(0);
}).catch(() => {
  process.exit(0);
});

