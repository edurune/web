import { setMusicDucked } from "./music.ts";

let holders = 0;

function syncAudioFocus() {
  setMusicDucked(holders > 0);
}

/** Lowers app audio while foreground media is audible. Every holder must release its focus. */
export function holdAudioFocus() {
  holders += 1;
  if (holders === 1) syncAudioFocus();

  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders = Math.max(0, holders - 1);
    if (holders === 0) syncAudioFocus();
  };
}
