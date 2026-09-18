import { OfflineBanner } from "./offline-banner.tsx";
import { UpdateBanner } from "./update-banner.tsx";
import { useAppUpdate } from "./use-app-update.ts";
import { useOnlineStatus } from "./use-online-status.ts";

export function PwaNotices() {
  const online = useOnlineStatus();
  const update = useAppUpdate();
  return (
    <>
      {!online && <OfflineBanner />}
      {update.ready && (
        <UpdateBanner
          applying={update.applying}
          onUpdate={update.apply}
          onDismiss={update.dismiss}
        />
      )}
    </>
  );
}
