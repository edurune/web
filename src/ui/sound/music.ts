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

interface MusicRequest {
  src: string;
  layer: MusicLayer;
  order: number;
}

interface Playback {
  audio: HTMLAudioElement;
  src: string;
  kind: "loop" | "stinger";
  removeListeners: () => void;
}

function playbackWasBlocked(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "NotAllowedError"
  );
}

class MusicManager {
  private playback: Playback | undefined;
  private enabled = (localStorage.getItem(KEY) ?? localStorage.getItem("voyage:music")) !== "off";
  private ducked = false;
  private requestOrder = 0;
  private readonly requests = new Map<symbol, MusicRequest>();
  private readonly fadeTimers = new WeakMap<HTMLAudioElement, number>();

  private level() {
    return this.ducked ? DUCKED_LEVEL : LEVEL;
  }

  private cancelFade(audio: HTMLAudioElement) {
    const timer = this.fadeTimers.get(audio);
    if (timer === undefined) return;
    window.clearInterval(timer);
    this.fadeTimers.delete(audio);
  }

  private fade(audio: HTMLAudioElement, to: number, duration: number) {
    this.cancelFade(audio);
    const from = audio.volume;
    const steps = Math.max(1, Math.round(duration / STEP_MS));
    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      audio.volume = from + (to - from) * Math.min(1, step / steps);
      if (step < steps) return;
      window.clearInterval(timer);
      this.fadeTimers.delete(audio);
    }, STEP_MS);
    this.fadeTimers.set(audio, timer);
  }

  private selectedTrack() {
    let selected: MusicRequest | undefined;
    for (const request of this.requests.values()) {
      if (
        !selected ||
        layerPriority[request.layer] > layerPriority[selected.layer] ||
        (request.layer === selected.layer && request.order > selected.order)
      ) {
        selected = request;
      }
    }
    return selected?.src ?? null;
  }

  private stop() {
    const playback = this.playback;
    this.playback = undefined;
    if (!playback) return;
    playback.removeListeners();
    this.cancelFade(playback.audio);
    // Pausing before another Audio element starts is the manager's one-track invariant.
    playback.audio.pause();
  }

  private finish(audio: HTMLAudioElement) {
    if (this.playback?.audio !== audio) return;
    this.stop();
    this.sync();
  }

  private start(src: string, kind: Playback["kind"]): Promise<boolean> {
    this.stop();
    const audio = new Audio(src);
    audio.loop = kind === "loop";
    audio.volume = 0;
    const finish = () => this.finish(audio);
    if (kind === "stinger") {
      audio.addEventListener("ended", finish, { once: true });
      audio.addEventListener("error", finish, { once: true });
    }
    this.playback = {
      audio,
      src,
      kind,
      removeListeners: () => {
        if (kind === "stinger") {
          audio.removeEventListener("ended", finish);
          audio.removeEventListener("error", finish);
        }
      },
    };
    return audio.play().then(
      () => {
        if (this.playback?.audio !== audio) {
          audio.pause();
          return false;
        }
        clearAudioBlocked("music");
        this.fade(audio, this.level(), FADE_MS);
        return true;
      },
      (error: unknown) => {
        if (this.playback?.audio === audio) this.stop();
        if (playbackWasBlocked(error)) markAudioBlocked("music");
        return false;
      },
    );
  }

  private sync() {
    if (!this.enabled) {
      this.stop();
      return;
    }
    if (this.playback?.kind === "stinger") return;
    const src = this.selectedTrack();
    if (this.playback?.kind === "loop" && this.playback.src === src) return;
    if (src) void this.start(src, "loop");
    else {
      this.stop();
      clearAudioBlocked("music");
    }
  }

  hold(src: string, layer: MusicLayer) {
    const token = Symbol();
    this.requests.set(token, { src, layer, order: ++this.requestOrder });
    this.sync();

    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.requests.delete(token);
      this.sync();
    };
  }

  async unlock() {
    const src = this.selectedTrack();
    if (!this.enabled || !src) {
      clearAudioBlocked("music");
      return true;
    }
    if (this.playback && !this.playback.audio.paused) {
      clearAudioBlocked("music");
      return true;
    }
    return this.start(src, "loop");
  }

  playStinger(src: string) {
    if (this.enabled) void this.start(src, "stinger");
  }

  setDucked(next: boolean) {
    if (this.ducked === next) return;
    this.ducked = next;
    const playback = this.playback;
    if (!playback) return;
    this.fade(playback.audio, this.level(), next ? DUCK_FADE_MS : RESTORE_FADE_MS);
  }

  isEnabled() {
    return this.enabled;
  }

  setEnabled(next: boolean) {
    if (this.enabled === next) return;
    this.enabled = next;
    localStorage.setItem(KEY, next ? "on" : "off");
    if (next) this.sync();
    else {
      clearAudioBlocked("music");
      this.stop();
    }
  }

  hasTrack() {
    return this.selectedTrack() !== null;
  }
}

const musicManager = new MusicManager();

export function holdMusic(src: string, layer: MusicLayer = "background") {
  return musicManager.hold(src, layer);
}

export function unlockMusic() {
  return musicManager.unlock();
}

export function startMusic() {
  let remove = () => {};
  const arm = () => {
    if (getAudioBlocked()) return;
    if (!musicManager.isEnabled() || !musicManager.hasTrack()) return;
    remove();
    void musicManager.unlock();
  };
  remove = onAudioGesture(arm);
  return remove;
}

export function playStinger(src: string) {
  musicManager.playStinger(src);
}

export function setMusicDucked(next: boolean) {
  musicManager.setDucked(next);
}

export function isMusicEnabled() {
  return musicManager.isEnabled();
}

export function setMusicEnabled(next: boolean) {
  musicManager.setEnabled(next);
}
