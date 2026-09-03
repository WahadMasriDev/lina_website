"use client";

import { createContext, useContext, useState } from "react";

// Shared signal for "the loading screen is done, the site can start
// behaving as if someone just landed on it." Without this, every
// entrance animation on the page (project text/video timing, the hero
// video's autoplay, project-detail section reveals) was keying off its
// own mount time -- and since the real page is already mounted and
// running underneath the covering loading screen the whole time it's up,
// those timers had already fired by the time the screen lifted. You'd
// land already a couple seconds into the first project's video instead
// of at a clean, still start. LoadingScreen flips this to true right as
// it starts fading out; everything else waits on it before starting its
// own clock.
const AppReadyContext = createContext<{
  ready: boolean;
  setReady: (ready: boolean) => void;
}>({ ready: false, setReady: () => {} });

export function AppReadyProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  return (
    <AppReadyContext.Provider value={{ ready, setReady }}>
      {children}
    </AppReadyContext.Provider>
  );
}

export function useAppReady() {
  return useContext(AppReadyContext).ready;
}

export function useSetAppReady() {
  return useContext(AppReadyContext).setReady;
}
