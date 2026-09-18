import { useEffect, useRef } from "react";
import { playSound } from "./sound.ts";

export function useOverlayCues(open: boolean) {
  const previous = useRef<boolean | null>(null);
  useEffect(() => {
    if (previous.current === open) return;
    const first = previous.current === null;
    previous.current = open;
    if (open) playSound("open");
    else if (!first) playSound("close");
  }, [open]);
}
