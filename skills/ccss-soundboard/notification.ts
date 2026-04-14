#!/usr/bin/env npx tsx
import { playSound, log, isNotify } from './shared';

const sound = 'notification.wav';

if (isNotify()) {
  log('Claude needs attention');
  playSound(sound);
}
