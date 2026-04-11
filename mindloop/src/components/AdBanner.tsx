import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

interface AdBannerProps {
  slot: string; // required — must be a real AdSense ad unit slot ID
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
  /** Minimum number of real DB items needed before showing the ad.
   *  Pass the count of actual content on the page. Default 1. */
  minContent?: number;
  /** Actual content count on the page (e.g. number of games loaded from DB) */
  contentCount?: number;
}

export default function AdBanner({
  slot,
  format = "auto",
  className = "",
  minContent = 1,
  contentCount = 0,
}: AdBannerProps) {
  const pushed = useRef(false);

  // Don't render if no valid slot ID or not enough real content
  const hasSlot = slot && slot.trim() !== "";
  const hasContent = contentCount >= minContent;

  useEffect(() => {
    if (!hasSlot || !hasContent) return;
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, [hasSlot, hasContent]);

  if (!hasSlot || !hasContent) return null;

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1548484551149334"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
