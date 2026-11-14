'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { wedding } from '@/config/wedding';
import { FX } from '@/lib/fx';
import { Score, FilePlayer, type Player } from '@/lib/score';
import { usePrefersReducedMotion, useRevealObserver } from '@/lib/hooks';
import { InvitationContext } from './InvitationContext';
import { Atmosphere } from './Atmosphere';
import { OpeningExperience } from './OpeningExperience';
import { Navigation } from './Navigation';
import { MusicController } from './MusicController';
import { ScratchReveal } from './ScratchReveal';
import { Countdown } from './Countdown';
import { StoryTimeline } from './StoryTimeline';
import { PhotoGallery } from './PhotoGallery';
import { EventTimeline } from './EventTimeline';
import { VenueSection } from './VenueSection';
import { FinalSection } from './FinalSection';

/** Orchestrates the whole experience: cover → scratch reveal → the rest of the invitation. */
export function Invitation() {
  const reduced = usePrefersReducedMotion();
  const fxCanvas = useRef<HTMLCanvasElement>(null);
  const fx = useRef<FX | null>(null);
  const music = useRef<Player | null>(null);
  const rest = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);   // pressed Enter
  const [opened, setOpened] = useState(false);     // cover fully gone
  const [revealed, setRevealed] = useState(false); // date revealed
  const [musicOn, setMusicOn] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    fx.current = new FX(fxCanvas.current!, reduced);
    return () => fx.current?.destroy();
  }, [reduced]);

  // Lock scrolling while the cover is closed
  useEffect(() => { document.documentElement.classList.toggle('is-closed', !entered); }, [entered]);

  // Pause when the tab is hidden, resume when back (unless the guest paused it)
  useEffect(() => {
    const onVis = () => {
      const m = music.current; if (!m) return;
      if (document.hidden && m.on) m.pause();
      else if (!document.hidden && !userPaused.current && entered) m.start();
      setMusicOn(m.on);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [entered]);

  useRevealObserver(rest, revealed);

  const enter = useCallback(() => {
    music.current ??= wedding.music.src ? new FilePlayer(wedding.music.src) : new Score();
    music.current.start(); setMusicOn(music.current.on);
    setEntered(true);
  }, []);
  const toggleMusic = useCallback(() => {
    const m = music.current; if (!m) return;
    if (m.on) { m.pause(); userPaused.current = true; } else { m.start(); userPaused.current = false; }
    setMusicOn(m.on);
  }, []);
  const onOpened = useCallback(() => {
    setOpened(true);
    document.getElementById('secretTitle')?.focus({ preventScroll: true });
  }, []);

  return (
    <InvitationContext.Provider value={{ fx, music, reduced, musicOn, toggleMusic }}>
      <Atmosphere />
      <canvas id="fx" ref={fxCanvas} aria-hidden="true" />
      <OpeningExperience onEnter={enter} onOpened={onOpened} />
      <Navigation show={opened} />
      <MusicController show={opened} />
      <main hidden={!entered}>
        <ScratchReveal active={entered} onRevealed={() => setRevealed(true)} />
        {revealed && (
          <div ref={rest}>
            <Countdown />
            <StoryTimeline />
            <PhotoGallery />
            <EventTimeline />
            <VenueSection />
            <FinalSection />
          </div>
        )}
      </main>
    </InvitationContext.Provider>
  );
}
