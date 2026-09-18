import { useEffect } from "react";
import { holdMusic, type MusicLayer } from "./music.ts";

export function useMusic(src: string | null, layer: MusicLayer = "background") {
  useEffect(() => {
    if (!src) return;
    return holdMusic(src, layer);
  }, [src, layer]);
}
