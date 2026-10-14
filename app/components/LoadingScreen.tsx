"use client";

import { useEffect, useRef, useState } from "react";
import { useSetAppReady } from "./AppReady";

// The real loading animation Nezar sent: the logo mark drawing itself in,
// then the full "LINA ZAKARIA" wordmark settling in, on a black card --
// matches the rest of the site rather than the white placeholder this
// used to assume. It plays twice through (not on a native infinite
// `loop` -- that gives no hook to know when to stop) before the site
// underneath is revealed.
//
// Fade-out waits on two things, whichever finishes last: the video has
// completed its second play-through, AND the page has actually finished
// loading (window "load"). That way a slow connection never cuts the
// animation short by revealing an unfinished page, and a fast connection
// never skips the second loop early.
const REQUIRED_PLAYS = 2;
const FADE_MS = 500;

// Plays exactly once per visit -- not on client-side <Link> navigation
// (that was already covered for free: LoadingScreen lives in the root
// layout, which Next.js keeps mounted across those), but also not on a
// plain refresh or one of the placeholder nav links (ABOUT / PERSONAL
// PLAYGROUND) that have to force a real page reload due to a Next.js
// static-export quirk. Without this, every one of those hard reloads sat
// through the full intro again, which felt broken rather than
// intentional -- once you've seen it, every other navigation on the site
// (Link or otherwise) should feel instant. A brand new tab still gets it.
const SESSION_KEY = "lina-loading-shown";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playCountRef = useRef(0);
  const videoDoneRef = useRef(false);
  const pageLoadedRef = useRef(false);
  const setAppReady = useSetAppReady();

  useEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Private browsing or storage blocked -- fall back to always
      // showing the intro rather than throwing.
    }
    if (alreadyShown) {
      setAppReady(true);
      setVisible(false);
      return;
    }

    const maybeFinish = () => {
      if (!videoDoneRef.current || !pageLoadedRef.current) return;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Same fallback as above -- if storage isn't available, the
        // intro just plays again next time. Not worth failing over.
      }
      // Flip the shared "ready" signal the instant the fade-out starts,
      // not after it finishes -- everything underneath (project video
      // autoplay, text/media timing, section reveals) is gated on this,
      // so this is the moment their own clocks should start ticking too.
      // The FADE_MS crossfade comfortably covers anything settling in.
      setAppReady(true);
      setFading(true);
      setTimeout(() => setVisible(false), FADE_MS);
    };

    const onPageLoad = () => {
      pageLoadedRef.current = true;
      maybeFinish();
    };

    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
    }

    const video = videoRef.current;
    const bail = () => {
      // Autoplay blocked, the file failed to load, or a replay got
      // rejected -- whatever the reason, don't hang forever waiting on a
      // video that's never going to finish.
      videoDoneRef.current = true;
      maybeFinish();
    };
    const onEnded = () => {
      playCountRef.current += 1;
      if (playCountRef.current >= REQUIRED_PLAYS) {
        videoDoneRef.current = true;
        maybeFinish();
      } else {
        // `ended` leaves currentTime sitting at the very last frame --
        // calling play() again without rewinding first doesn't restart
        // playback in most browsers (it either stays frozen on the last
        // frame, or the replay silently fails and falls into the `bail`
        // catch below), which was skipping straight to reveal instead of
        // actually holding through a second loop. Rewind explicitly.
        if (video) video.currentTime = 0;
        video?.play().catch(bail);
      }
    };
    video?.addEventListener("ended", onEnded);
    video?.addEventListener("error", bail);
    video?.play().catch(bail);

    return () => {
      window.removeEventListener("load", onPageLoad);
      video?.removeEventListener("ended", onEnded);
      video?.removeEventListener("error", bail);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      // z-[100], not z-50: the header also uses z-50 in its floating
      // (overlay) mode, and it renders *after* this in the DOM (it lives
      // in `children`, this sits above it in the root layout) -- at equal
      // z-index, later DOM order wins the paint order, so the header could
      // actually show through on top of this. Sitting strictly higher
      // guarantees nothing on the page -- header included -- can ever
      // paint over the loading screen while it's up.
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity ease-out ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      // The video's own background isn't quite pure #000 (rgb(1,1,1),
      // likely just compression rounding) -- matching the overlay to
      // that exact value instead of true black avoids a faint visible
      // seam around the video where the two blacks almost-but-don't-
      // quite line up.
      style={{ transitionDuration: `${FADE_MS}ms`, backgroundColor: "rgb(1, 1, 1)" }}
    >
      <video
        ref={videoRef}
        src="/videos/logo-intro.mp4"
        muted
        playsInline
        preload="auto"
        className="h-auto w-[min(70vw,420px)]"
      />
    </div>
  );
}
