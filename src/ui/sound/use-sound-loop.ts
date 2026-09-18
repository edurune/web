import { useEffect } from "react";
import { holdLoop, type CueName } from "./sound.ts";

export function useSoundLoop(cue: CueName, active: boolean) {
  useEffect(() => {
    if (!active) return;
    return holdLoop(cue);
  }, [cue, active]);
}
