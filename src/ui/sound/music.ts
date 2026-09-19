import {
  clearAudioBlocked,
  getAudioBlocked,
  markAudioBlocked,
  onAudioGesture,
} from "./audio-gate.ts";

const KEY = "music";
const FADE_MS = 800;
const STEP_MS = 40;
const LEVEL = 0.32;
const DUCKED_LEVEL = 0.08;
const DUCK_FADE_MS = 160;
const RESTORE_FADE_MS = 400;

export type MusicLayer = "background" | "scene";

const layerPriority: Record<MusicLayer, number> = {
  background: 0,
  scene: 1,
};

let playing: HTMLAudioElement | undefined;
let track: string | null = null;
let enabled = (localStorage.getItem(KEY) ?? localStorage.getItem("voyage:music")) !== "off";
let ducked = false;
let requestOrder = 0;
const requests = new Map<symbol, { src: string; layer: MusicLayer; order: number }>();
const stingers = new Set<HTMLAudioElement>();
const fadeTimers = new WeakMap<HTMLAudioElement, number>();

function level() {
  return ducked ? DUCKED_LEVEL : LEVEL;
}

function cancelFade(audio: HTMLAudioElement) {
  const timer = fadeTimers.get(audio);
  if (timer === undefined) return;
  window.clearInterval(timer);
  fadeTimers.delete(audio);
}

function fade(audio: HTMLAudioElement, to: number, duration = FADE_MS, done?: () => void) {
  cancelFade(audio);
  const from = audio.volume;
  const steps = Math.max(1, Math.round(duration / STEP_MS));
  let step = 0;
  const timer = window.setInterval(() => {
    step += 1;
    audio.volume = from + (to - from) * Math.min(1, step / steps);
    if (step < steps) return;
    window.clearInterval(timer);
    fadeTimers.delete(audio);
    done?.();
  }, STEP_MS);
  fadeTimers.set(audio, timer);
}

function playbackWasBlocked(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "NotAllowedError"
  );
}

function start(src: string): Promise<boolean> {
  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = 0;
  playing = audio;
  return audio.play().then(
    () => {
      clearAudioBlocked("music");
      fade(audio, level());
      return true;
    },
    (error: unknown) => {
      if (playing === audio) playing = undefined;
      if (playbackWasBlocked(error)) markAudioBlocked("music");
      return false;
    },
  );
}

function stop() {
  const audio = playing;
  playing = undefined;
  if (audio) fade(audio, 0, FADE_MS, () => audio.pause());
}

function playMusic(src: string | null) {
  if (src === track) return;
  track = src;
  stop();
  if (src && enabled) void start(src);
  else clearAudioBlocked("music");
}

function syncMusic() {
  let selected: { src: string; layer: MusicLayer; order: number } | undefined;
  for (const request of requests.values()) {
    if (
      !selected ||
      layerPriority[request.layer] > layerPriority[selected.layer] ||
      (request.layer === selected.layer && request.order > selected.order)
    ) {
      selected = request;
    }
  }
  playMusic(selected?.src ?? null);
}

export function holdMusic(src: string, layer: MusicLayer = "background") {
  const token = Symbol();
  requests.set(token, { src, layer, order: ++requestOrder });
  syncMusic();

  let released = false;
  return () => {
    if (released) return;
    released = true;
    requests.delete(token);
    syncMusic();
  };
}

export async function unlockMusic() {
  if (!enabled || !track) {
    clearAudioBlocked("music");
    return true;
  }
  if (playing && !playing.paused) {
    clearAudioBlocked("music");
    return true;
  }
  const src = track;
  stop();
  return start(src);
}

export function startMusic() {
  let remove = () => {};
  const arm = () => {
    if (getAudioBlocked()) return;
    if (!enabled || !track) return;
    remove();
    void unlockMusic();
  };
  remove = onAudioGesture(arm);
  return remove;
}

export function playStinger(src: string) {
  if (!enabled) return;
  const audio = new Audio(src);
  const forget = () => {
    cancelFade(audio);
    stingers.delete(audio);
  };
  audio.addEventListener("ended", forget, { once: true });
  audio.addEventListener("error", forget, { once: true });
  audio.volume = level();
  stingers.add(audio);
  audio.play().then(
    () => clearAudioBlocked("music"),
    (error: unknown) => {
      forget();
      if (playbackWasBlocked(error)) markAudioBlocked("music");
    },
  );
}

export function setMusicDucked(next: boolean) {
  if (ducked === next) return;
  ducked = next;
  const duration = next ? DUCK_FADE_MS : RESTORE_FADE_MS;
  const target = level();
  if (playing) fade(playing, target, duration);
  for (const stinger of stingers) fade(stinger, target, duration);
}

export function isMusicEnabled() {
  return enabled;
}

export function setMusicEnabled(next: boolean) {
  enabled = next;
  localStorage.setItem(KEY, next ? "on" : "off");
  if (next && track) void start(track);
  else {
    clearAudioBlocked("music");
    stop();
  }
}
