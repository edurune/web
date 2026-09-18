export type AudioChannel = "music" | "sound";

const audioGestures = ["pointerdown", "keydown", "touchstart"] as const;

const blockedChannels = new Set<AudioChannel>();
const listeners = new Set<() => void>();
let blocked = false;

function publish() {
  const next = blockedChannels.size > 0;
  if (next === blocked) return;
  blocked = next;
  for (const listener of listeners) listener();
}

export function markAudioBlocked(channel: AudioChannel) {
  blockedChannels.add(channel);
  publish();
}

export function clearAudioBlocked(channel: AudioChannel) {
  blockedChannels.delete(channel);
  publish();
}

export function subscribeToAudioBlocked(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAudioBlocked() {
  return blocked;
}

export function onAudioGesture(listener: () => void) {
  if (typeof document === "undefined") return () => {};
  const remove = () => {
    for (const gesture of audioGestures) document.removeEventListener(gesture, listener);
  };
  for (const gesture of audioGestures) {
    document.addEventListener(gesture, listener, { passive: true });
  }
  return remove;
}
