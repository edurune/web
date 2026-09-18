import {
  bindUISFX,
  type CueName,
  type PlayOptions,
  type PlayingSFX,
  type UISFXBinding,
} from "uisfx";
import {
  clearAudioBlocked,
  getAudioBlocked,
  markAudioBlocked,
  onAudioGesture,
} from "./audio-gate.ts";

export type { CueName } from "uisfx";

const PACK = "organic";
const PREFERENCE_KEY = "uisfx:preferences";

let binding: UISFXBinding | undefined;
let unlocked = false;

function getBinding() {
  if (typeof window === "undefined") return undefined;
  binding ??= bindUISFX(document, { pack: PACK, preferences: {} });
  return binding;
}

function getPlayer() {
  return getBinding()?.player;
}

export function playSound(cue: CueName, options?: PlayOptions) {
  if (!isSoundEnabled()) return;
  if (!unlocked) {
    markAudioBlocked("sound");
    return;
  }
  getPlayer()?.play(cue, options);
}

interface Loop {
  holders: number;
  playing: PlayingSFX | null;
}

const loops = new Map<CueName, Loop>();

export function holdLoop(cue: CueName) {
  const loop = loops.get(cue) ?? { holders: 0, playing: null };
  loops.set(cue, loop);
  loop.holders += 1;
  if (loop.holders === 1 && isSoundEnabled()) {
    if (unlocked) loop.playing = getPlayer()?.play(cue, { loop: true }) ?? null;
    else markAudioBlocked("sound");
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    loop.holders -= 1;
    if (loop.holders > 0) return;
    loop.playing?.stop();
    loop.playing = null;
  };
}

function silenceLoops() {
  for (const loop of loops.values()) {
    loop.playing?.stop();
    loop.playing = null;
  }
}

function resumeLoops() {
  if (!unlocked || !isSoundEnabled()) return;
  for (const [cue, loop] of loops) {
    if (loop.holders === 0) continue;
    loop.playing?.stop();
    loop.playing = getPlayer()?.play(cue, { loop: true }) ?? null;
  }
}

export async function unlockSound() {
  if (!isSoundEnabled()) {
    clearAudioBlocked("sound");
    return true;
  }
  const player = getPlayer();
  if (!player) return true;
  const wasUnlocked = unlocked;
  const ready = await player.unlock();
  unlocked = ready;
  if (ready) {
    clearAudioBlocked("sound");
    if (!wasUnlocked) resumeLoops();
  } else {
    markAudioBlocked("sound");
  }
  return ready;
}

export function startSound() {
  const arm = () => {
    if (getAudioBlocked()) return;
    void unlockSound();
  };
  return onAudioGesture(arm);
}

export function isSoundEnabled() {
  if (binding) return binding.player.isEnabled();
  try {
    const preference = JSON.parse(localStorage.getItem(PREFERENCE_KEY) ?? "{}");
    return typeof preference.enabled === "boolean" ? preference.enabled : true;
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean) {
  const player = getPlayer();
  if (!player) return;
  player.setEnabled(enabled);
  if (enabled) void unlockSound();
  else {
    clearAudioBlocked("sound");
    player.stopAll();
    silenceLoops();
  }
}
