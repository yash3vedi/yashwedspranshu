'use client';
import { useEffect, useRef, useState } from 'react';
import { wedding } from '@/config/wedding';
import { Monogram } from './Monogram';
import { useInvitation } from './InvitationContext';

const LINKS = [['home', 'Home'], ['story', 'Our story'], ['celebrations', 'Celebrations'], ['venue', 'Venue']] as const;

/** Monogram top-left, a quiet menu button top-right, full-screen menu. */
export function Navigation({ show }: { show: boolean }) {
  const { reduced } = useInvitation();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null), close = useRef<HTMLButtonElement>(null), first = useRef(true);
  const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    (open ? close : btn).current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [open]);

  function go(id: string) { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior }); }

  return (
    <>
      <header className={`nav${show ? ' show' : ''}`}>
        <button className="nav-mono" type="button" aria-label="Back to top" onClick={() => scrollTo({ top: 0, behavior })}><Monogram size="46px" /></button>
        <button ref={btn} className="nav-menu" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(true)}>Menu <i aria-hidden="true" /></button>
      </header>
      <nav id="menu" className={`menu${open ? ' open' : ''}`} aria-label="Sections" aria-hidden={!open}>
        <button ref={close} className="menu-close" type="button" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>Close</button>
        {LINKS.map(([id, label]) => (
          <a key={id} href={`#${id}`} tabIndex={open ? 0 : -1} onClick={e => { e.preventDefault(); go(id); }}>{label}</a>
        ))}
        <p className="menu-foot">{wedding.couple.hashtag}</p>
      </nav>
    </>
  );
}
