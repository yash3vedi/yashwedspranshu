/* =========================================================
   WEDDING CONFIG — the only file most people need to edit.
   Change names, dates, events, photos, venue and music here.
   Save the file; the dev server updates the page instantly.
   ========================================================= */

export type MotifName = 'lotus' | 'diya' | 'marigold' | 'sangeet' | 'rings' | 'toran' | 'reception' | 'phere';

export interface EventItem {
  name: string;
  time: string;
  motif: MotifName;
  desc?: string;
  dress?: string;           // adds a "Dress code" badge
  note?: string;            // small extra line
  variant?: 'haldi' | 'night';
}
export interface Day { num: string; month: string; week: string; events: EventItem[] }
export interface Chapter {
  title: string;
  lines?: string[];
  notif?: string;           // shows the little notification pill
  years?: number;           // shows an animated "10+" counter
  final?: boolean;          // the closing chapter
  big?: string;
  sig?: string;
}
export interface Photo { src: string; alt: string; caption: string }

export const wedding = {
  couple: {
    groom: 'Yash Trivedi',
    bride: 'Pranshu Jain',
    first: ['Yash', 'Pranshu'] as [string, string],
    initials: ['Y', 'P'] as [string, string],
    hashtag: '#PraYas',
  },

  opening: {
    shloka: '॥ श्री गणेशाय नमः ॥',
    tagline: ['A story that began as classmates…', 'and became a lifetime.'],
    // Ganesh ji artwork on the cover (transparent PNG/SVG in /public/images). It is tinted to match the shloka. Empty = lotus.
    ganeshaArt: '/images/ganesha.png',
  },

  date: {
    countdownTarget: '2026-12-09T19:00:00+05:30', // 9 Dec 2026, 7 PM IST — keep +05:30
    day: '09',
    month: 'December',
    year: '2026',
    revealLine: 'Wednesday, the ninth of December',
    revealSmall: '7 PM onwards · Indore',
    countFoot: 'Until 9 December 2026, 7 PM, in Indore',
    doneMessage: ['Today, we become family.', 'Come celebrate with us.'],
    displayDate: '9 December 2026 · Indore',
  },

  // "Together with their families" page, shown right after the countdown
  families: {
    kicker: '॥ शुभ विवाह ॥',
    intro: 'Together with their families',
    groom: { name: 'Yash', parents: 'S/o Seema & Late Sanjay Trivedi' },
    bride: { name: 'Pranshu', parents: 'D/o Nilima & Pushkar Raj Jain' },
    invite: 'Cordially invite you to join the occasion of joyous wedding festivities',
    when: 'Wednesday, 9 December 2026',
    where: 'Shri Niketan Marriage Garden, Indore',
    blessing: 'Your presence and blessings will make our celebration complete.',
    from: 'With warm regards, the Trivedi & Jain families',
  },

  story: [
    { title: 'School', lines: ['We were in the same school…', '…but somehow, never really met.'] },
    { title: 'A little blue notification', lines: ['Years later, life found a way to reconnect us.'], notif: '1 new friend request' },
    { title: 'Friendship', lines: ['Conversations became friendship.'] },
    { title: 'Somewhere along the way', lines: ['Friendship became something more.'] },
    { title: '10+ years', lines: ['And somehow, more than ten years passed…'], years: 10 },
    { title: 'No big proposal', lines: ['No grand proposal.', 'No perfect movie scene.', 'Just two people slowly finding their way to each other.'] },
    { title: 'Final chapter', final: true, big: 'And here we are.', sig: 'Ready to begin forever.' },
  ] as Chapter[],
  storySub: 'Seven small chapters, and more than ten years.',

  // Put photos in /public/images. Recommended 1200×1500 (4:5), JPG/WebP, < 350 KB.
  // Example: { src: '/images/photo-1.jpg', alt: 'Yash and Pranshu at…', caption: '…' }
  photos: [
    { src: '', alt: 'Yash and Pranshu', caption: 'Somewhere between then and now.' },
    { src: '', alt: 'Yash and Pranshu', caption: 'Ten years. One beautiful story.' },
    { src: '', alt: 'Yash and Pranshu', caption: 'Still choosing each other.' },
    { src: '', alt: 'Yash and Pranshu', caption: 'Home, in each other.' },
  ] as Photo[],

  celebrationsSub: 'Two days, one garden, all of you.',
  days: [
    { num: '8', month: 'December', week: 'Tuesday', events: [
      { name: 'Ganesh Pooja', time: '9:00 AM', motif: 'diya', desc: 'We begin, as every good thing does, with Ganpati’s blessing.' },
      { name: 'Haldi Carnival', time: '2:30 PM', motif: 'marigold', desc: 'Turmeric, laughter and a little happy chaos.', dress: 'Yellow', variant: 'haldi' },
      { name: 'Sangeet', time: '7:00 PM', motif: 'sangeet', desc: 'An evening of songs, dances and everyone’s secret rehearsals.' },
    ]},
    { num: '9', month: 'December', week: 'Wednesday, the wedding day', events: [
      { name: 'Engagement', time: '11:00 AM', motif: 'rings', desc: 'Two rings, one promise, and all of you watching.' },
      { name: 'Baraat', time: '4:00 PM', motif: 'toran', desc: 'The groom arrives, with the whole procession dancing.' },
      { name: 'Reception', time: '7:00 PM', motif: 'reception', desc: 'The evening we celebrate with everyone we love.' },
    ]},
  ] as Day[],

  venue: {
    name: 'Shri Niketan Marriage Garden',
    address: ['A.B. Road, near Toll Tax', 'Umariya, Indore', 'Madhya Pradesh'],
    note: 'Every celebration takes place here.',
    // Google Maps → Share → Copy link (exact pin):
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Shri+Niketan+Marriage+Garden+Umaria+Indore',
    // Google Maps → Share → Embed a map → copy only the src="…" value:
    embedUrl: 'https://www.google.com/maps?q=Shri+Niketan+Marriage+Garden,+Umaria,+Indore&output=embed',
  },

  finale: {
    statement: ["We can't wait", 'to celebrate', 'with you'],
    line: 'The beginning of #PraYas',
    signature: 'Yash & Pranshu',
  },

  // Optional recorded track in /public/audio, e.g. '/audio/prayas-theme.mp3'. Empty = built-in generated score.
  music: { src: '/audio/Blue-Yung-Kai.mp3' },
};

export type Wedding = typeof wedding;
