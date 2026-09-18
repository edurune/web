import { registerSW } from "virtual:pwa-register";

const CHECK_INTERVAL_MS = 60 * 60 * 1000;

const listeners = new Set<() => void>();
let ready = false;
let applying = false;
let update: (reload?: boolean) => Promise<void> = async () => {};

function emit() {
  for (const listener of listeners) listener();
}

function watchForUpdates(registration: ServiceWorkerRegistration) {
  let checkedAt = Date.now();
  const check = () => {
    if (document.visibilityState !== "visible" || !navigator.onLine) return;
    if (Date.now() - checkedAt < CHECK_INTERVAL_MS) return;
    checkedAt = Date.now();
    void registration.update();
  };
  setInterval(check, CHECK_INTERVAL_MS);
  document.addEventListener("visibilitychange", check);
  window.addEventListener("online", check);
}

export function registerServiceWorker() {
  update = registerSW({
    onNeedRefresh() {
      ready = true;
      emit();
    },
    onRegisteredSW(_swUrl, registration) {
      if (registration) watchForUpdates(registration);
    },
  });
}

export function subscribeToUpdates(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isUpdateReady() {
  return ready;
}

export function isUpdateApplying() {
  return applying;
}

export function applyUpdate() {
  applying = true;
  emit();
  void update(true);
}

export function dismissUpdate() {
  ready = false;
  emit();
}
