#!/usr/bin/env npx tsx
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { playSound } from './shared';

const hookName = process.argv[2];
const skillDir = path.dirname(__filename);
const configPath = path.join(skillDir, 'sounds.json');

if (!hookName) {
  console.error('Usage: play.ts <HookName>');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const entry = config[hookName];

if (!entry) {
  console.error(`No sound mapped for hook: ${hookName}`);
  process.exit(1);
}

const sound = typeof entry === 'string' ? entry : entry.sound;
const checkFocus = typeof entry === 'object' && entry.checkFocus;

if (checkFocus && isClaudeCodeFocused()) {
  process.exit(0);
}

playSound(`soundboard/${sound}.wav`);

function isClaudeCodeFocused(): boolean {
  try {
    if (process.platform === 'win32') {
      const result = execSync(
        `powershell -c "(Get-Process -Id $((Get-ParentProcess -Id $PID).ParentId).Id).MainWindowTitle"`,
        { encoding: 'utf-8', stdio: 'pipe' }
      ).trim();
      return result.includes('Claude');
    }
  } catch {}
  return false;
}
