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

export type MusicLayer = "background" | "scene";

const layerPriority: Record<MusicLayer, number> = {
  background: 0,
  scene: 1,
};

let playing: HTMLAudioElement | undefined;
let track: string | null = null;
let enabled = (localStorage.getItem(KEY) ?? localStorage.getItem("voyage:music")) !== "off";
let requestOrder = 0;
const requests = new Map<symbol, { src: string; layer: MusicLayer; order: number }>();

function fade(audio: HTMLAudioElement, to: number, done?: () => void) {
  const from = audio.volume;
  const steps = Math.round(FADE_MS / STEP_MS);
  let step = 0;
  const timer = window.setInterval(() => {
    step += 1;
    audio.volume = from + (to - from) * Math.min(1, step / steps);
    if (step < steps) return;
    window.clearInterval(timer);
    done?.();
  }, STEP_MS);
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
      fade(audio, LEVEL);
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
  if (audio) fade(audio, 0, () => audio.pause());
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
  audio.volume = LEVEL;
  audio.play().then(
    () => clearAudioBlocked("music"),
    (error: unknown) => {
      if (playbackWasBlocked(error)) markAudioBlocked("music");
    },
  );
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
