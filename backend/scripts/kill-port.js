/**
 * Kill process running on port 4000
 * Run: node scripts/kill-port.js
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function killPort(port = 4000) {
  console.log(`🔍 Finding process on port ${port}...\n`);
  
  try {
    // Windows command to find PID
    const { stdout } = await execAsync(`netstat -ano | findstr :${port} | findstr LISTENING`);
    
    if (!stdout || stdout.trim() === '') {
      console.log(`✅ Port ${port} is already free!`);
      return;
    }
    
    // Extract PID (last number in the line)
    const lines = stdout.trim().split('\n');
    const pids = new Set();
    
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(pid)) {
        pids.add(pid);
      }
    }
    
    if (pids.size === 0) {
      console.log(`✅ No process found on port ${port}`);
      return;
    }
    
    console.log(`📋 Found ${pids.size} process(es) on port ${port}`);
    
    // Kill each process
    for (const pid of pids) {
      try {
        console.log(`🛑 Killing process ${pid}...`);
        await execAsync(`taskkill /F /PID ${pid}`);
        console.log(`✅ Process ${pid} killed successfully`);
      } catch (error) {
        if (error.message.includes('not found') || error.message.includes('does not exist')) {
          console.log(`ℹ️  Process ${pid} already terminated`);
        } else {
          console.log(`⚠️  Could not kill process ${pid}: ${error.message}`);
        }
      }
    }
    
    // Verify
    await new Promise(resolve => setTimeout(resolve, 1000));
    const { stdout: verify } = await execAsync(`netstat -ano | findstr :${port} | findstr LISTENING`);
    
    if (!verify || verify.trim() === '') {
      console.log(`\n✅ Port ${port} is now free!`);
    } else {
      console.log(`\n⚠️  Port ${port} may still be in use. Try running this script again.`);
    }
  } catch (error) {
    if (error.message.includes('findstr') || error.message.includes('not found')) {
      console.log(`✅ Port ${port} is already free!`);
    } else {
      console.error(`❌ Error: ${error.message}`);
      console.log('\n💡 Manual steps:');
      console.log(`   1. Open Task Manager`);
      console.log(`   2. Find the process using port ${port}`);
      console.log(`   3. End the process`);
    }
  }
}

killPort(4000).catch(console.error);

