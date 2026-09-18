import { useEffect, useRef } from "react";
import { playSound, type CueName } from "./sound.ts";

export function useSoundWhen(cue: CueName | null, signal: boolean) {
  const raised = useRef(false);
  useEffect(() => {
    if (signal && !raised.current && cue) playSound(cue);
    raised.current = signal;
  }, [cue, signal]);
}
