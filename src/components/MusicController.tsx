'use client';
import { useInvitation } from './InvitationContext';

/** Small floating play/pause control, shown after entering. */
export function MusicController({ show }: { show: boolean }) {
  const { musicOn, toggleMusic } = useInvitation();
  return (
    <button className={`music${show ? ' show' : ''}${musicOn ? ' playing' : ''}`} type="button"
      aria-label={musicOn ? 'Pause music' : 'Play music'} aria-pressed={musicOn} onClick={toggleMusic}>
      <span className="bars" aria-hidden="true"><span /><span /><span /></span>
    </button>
  );
}
