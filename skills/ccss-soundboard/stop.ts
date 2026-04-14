#!/usr/bin/env npx tsx
import { playSound, log } from './shared';

const sound = 'done.wav';
log('Claude finished task');
playSound(sound);
