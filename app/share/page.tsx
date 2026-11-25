import { Suspense } from "react";
import { ShareReceiver } from "@/components/share-receiver";

// Story 13: target of the phone's share menu (Android) or an iPhone
// shortcut. The shared link or text arrives as query parameters.
export default function SharePage() {
  return (
    <Suspense>
      <ShareReceiver />
    </Suspense>
  );
}
