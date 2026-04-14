import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const hooksDir = path.dirname(__filename);

export const playSound = (filename: string): void => {
  const filePath = path.join(hooksDir, filename);

  if (!fs.existsSync(filePath)) {
    console.error(`Sound file not found: ${filePath}`);
    return;
  }

  const cmd = getPlayCommand(filePath);
  try {
    execSync(cmd, { stdio: 'ignore' });
  } catch (e) {
    console.error(`Failed to play sound: ${(e as Error).message}`);
  }
};

export const getPlayCommand = (filePath: string): string => {
  const platform = process.platform;

  if (platform === 'darwin') {
    return `afplay "${filePath}"`;
  } else if (platform === 'win32') {
    return `PowerShell -c (New-Object System.Media.SoundPlayer "${filePath}").PlaySync()`;
  } else {
    return `aplay "${filePath}" 2>/dev/null || paplay "${filePath}"`;
  }
};

export const log = (message: string): void => {
  const logFile = path.join(hooksDir, 'activity.log');
  const entry = { timestamp: new Date().toISOString(), message };
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
};

export const isNotify = (): boolean => {
  return process.argv.includes('--notify');
};
