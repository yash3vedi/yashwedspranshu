'use client';
import { createContext, useContext } from 'react';
import type { FX } from '@/lib/fx';
import type { Player } from '@/lib/score';

export interface InvitationCtx {
  fx: React.RefObject<FX | null>;
  music: React.RefObject<Player | null>;
  reduced: boolean;
  musicOn: boolean;
  toggleMusic: () => void;
}
export const InvitationContext = createContext<InvitationCtx | null>(null);
export const useInvitation = () => {
  const c = useContext(InvitationContext);
  if (!c) throw new Error('useInvitation must be used inside <Invitation>');
  return c;
};
