import { useSyncExternalStore } from "react";
import {
  applyUpdate,
  dismissUpdate,
  isUpdateApplying,
  isUpdateReady,
  subscribeToUpdates,
} from "./service-worker.ts";

export interface AppUpdate {
  ready: boolean;
  applying: boolean;
  apply: () => void;
  dismiss: () => void;
}

export function useAppUpdate(): AppUpdate {
  const ready = useSyncExternalStore(subscribeToUpdates, isUpdateReady, () => false);
  const applying = useSyncExternalStore(subscribeToUpdates, isUpdateApplying, () => false);
  return { ready, applying, apply: applyUpdate, dismiss: dismissUpdate };
}
