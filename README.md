# Yash ♥ Pranshu · #PraYas

A cinematic digital wedding invitation for 8–10 December 2026, at Shri Niketan Marriage Garden, Indore.

It is built with **Next.js 15, React 19 and TypeScript**. Fonts are self-hosted, so they always load and nothing depends on Google Fonts. It exports as a static site that runs on Vercel, or on any host.

---

## 1. Quick start

You need **Node.js 18.18 or newer**. Download the LTS version from https://nodejs.org.

```bash
cd prayas-invitation
npm install        # first time only
npm run dev        # starts the site at http://localhost:3000
```

Open http://localhost:3000. Edits to any file update the page instantly.

**Testing on your phone:** keep `npm run dev` running and connect the phone to the same Wi-Fi. Then open `http://<your-computer-IP>:3000` on the phone. The terminal prints this "Network" address for you.

**Production build:**

```bash
npm run build      # creates the finished site in the /out folder
npm start          # previews /out at http://localhost:3000
```

---

## 2. Put it online with Vercel (free)

### Option A: GitHub (recommended, auto-updates)

1. Push this folder to a new GitHub repository.
2. Go to https://vercel.com, then **Add New → Project**, and import the repository.
3. Vercel detects Next.js automatically. Click **Deploy**.
4. Every time you push a change to GitHub, the site redeploys by itself.

### Option B: from your computer

```bash
npm i -g vercel
vercel          # first deploy (accept the defaults)
vercel --prod   # publish to your live link
```

**Custom domain** (e.g. `prayas.in`): in Vercel, go to **Project → Settings → Domains → Add** and follow the DNS steps.

**Other hosts:** run `npm run build` and upload the `/out` folder to Netlify, Cloudflare Pages or GitHub Pages.

---

## 3. Project structure

```
src/
├── config/wedding.ts        ← ALL CONTENT. Edit this file.
├── app/
│   ├── layout.tsx           Page title, share preview text, fonts
│   ├── page.tsx             Entry point
│   └── globals.css          All styling. Colours are at the top.
├── components/
│   ├── Invitation.tsx       Orchestrates the whole experience
│   ├── OpeningExperience    Cover screen + gatefold opening
│   ├── ScratchReveal        Rose-gold scratch card + reveal sequence
│   ├── DateReveal           09 · December · 2026 under the foil
│   ├── Countdown            IST countdown
│   ├── StoryTimeline        The 7 story chapters + gold thread
│   ├── PhotoGallery         Polaroids
│   ├── EventTimeline        Days of celebrations
│   ├── EventCard            One arch-shaped event card
│   ├── VenueSection         Venue + lazy Google Map
│   ├── FinalSection         Closing frame
│   ├── Navigation           Monogram + menu
│   ├── MusicController      Play/pause button
│   ├── Monogram, Motif      Y ✦ P seal, line-art icons
│   └── Atmosphere           Background light, leaves, grain
└── lib/
    ├── fx.ts                Petal + gold particle system (one canvas)
    ├── score.ts             Generated music, or recorded-track player
    └── hooks.ts             Scroll reveals, reduced-motion detection
public/
├── images/                  Your photos + Ganesha art go here
└── audio/                   Optional music file goes here
```

**Rule of thumb:**
- **Content** → `src/config/wedding.ts`
- **Colours and fonts** → `src/app/globals.css`
- **Everything else** you normally never need to touch.

---

## 4. What to change, and where

All of these are in **`src/config/wedding.ts`**.

| What you want to change | Setting |
|---|---|
| Names, monogram letters, hashtag | `couple` |
| Shloka, tagline on the cover | `opening.shloka`, `opening.tagline` |
| Ganesha artwork on the cover | `opening.ganeshaArt` (see below) |
| What the scratch card reveals | `date.day`, `date.month`, `date.year` |
| Lines under the revealed date | `date.revealLine`, `date.revealSmall` |
| Countdown moment | `date.countdownTarget` (keep `+05:30` = IST) |
| Message when the countdown ends | `date.doneMessage` |
| Story chapters | `story` |
| Line under "Our story" | `storySub` |
| Photos and captions | `photos` |
| Events, dates, times, dress codes | `days` |
| Line under "The celebrations" | `celebrationsSub` |
| Venue name, address, map | `venue` |
| Final statement and sign-off | `finale` |
| Music | `music.src` |

### Story chapters

```ts
{ title: 'School', lines: ['We were in the same school…', '…but somehow, never really met.'] },
{ title: 'A little blue notification', lines: ['…'], notif: '1 new friend request' },
{ title: '10+ years', lines: ['…'], years: 10 },
{ title: 'Final chapter', final: true, big: 'And here we are.', sig: 'Ready to begin forever.' },
```

- Chapter numbers (01, 02…) are generated automatically.
- In a chapter with exactly 2 lines, the second line is shown in soft italics.
- `notif` adds the little notification pill.
- `years` adds the animated "10+" counter.
- `final: true` is the closing chapter. Keep it last.

### Photos

1. Put your photos in `public/images/`, for example `public/images/photo-1.jpg`.
2. Reference them **starting with `/images/`**:

```ts
photos: [
  { src: '/images/photo-1.jpg', alt: 'Yash and Pranshu at their school annual day', caption: 'Somewhere between then and now.' },
  …
]
```

- `src: ''` shows a tasteful placeholder.
- 3–5 photos look best.
- Write a real description in `alt`; it is read aloud by screen readers.

| Recommended | |
|---|---|
| Shape | Portrait **4:5** (cropped to this) |
| Size | **1200 × 1500 px** |
| Format | **JPG** (quality ~80) or **WebP** |
| File size | **under 350 KB** each; compress at https://squoosh.app |

### Ganesha artwork

Put a **fine line-art** Ganesha in `public/images/`, gold or cocoa on a transparent background, SVG or PNG, about 160×160 px. Then set:

```ts
ganeshaArt: '/images/ganesha.svg',
```

Leave it empty and a small lotus is shown instead.

### Events

```ts
{ name: 'Haldi Carnival', time: '2:00 PM', motif: 'marigold', desc: '…', dress: 'Yellow', variant: 'haldi' }
```

| Field | Meaning |
|---|---|
| `motif` | Icon: `diya` `marigold` `sangeet` `rings` `toran` `reception` `phere` `lotus` |
| `dress` | Shows a "Dress code" badge |
| `note` | Small extra line under the description |
| `variant` | `'haldi'` = soft yellow card · `'night'` = night-sky card (used for Phere) |

### Venue map: use the exact pin

The current links search by venue name. For the exact entrance:

1. In Google Maps, find the venue (or drop a pin on the gate) and tap **Share → Copy link**. Paste it into `venue.mapsUrl`.
2. On desktop, go to **Share → Embed a map → Copy HTML**. Paste **only the `src="…"` value** into `venue.embedUrl`.

### Music

By default an **original instrumental is generated live in the browser**: bansuri, tanpura, santoor, soft strings and tabla. It becomes richer after the date reveal and again at the story. It adds no file size and has no copyright issues.

To use a recorded track instead:

1. Put the file at `public/audio/prayas-theme.mp3`. Keep it under ~4 MB; it loops.
2. Set `music: { src: '/audio/prayas-theme.mp3' }`.

Only use music you have the rights to.

Music starts only after **Enter invitation** is pressed, because browsers block autoplay. Guests can pause it with the button in the bottom-right corner.

To edit the generated melody, open `src/lib/score.ts`:
- `MELODY` holds the notes, in sargam (`S R G m P D N`; `.` = lower octave, `'` = upper octave).
- `CHORDS` holds the chords.
- `TEMPO` and `SA` (the key) are just below them.

---

## 5. Changing the look

### Colours

At the top of `src/app/globals.css`:

```css
--ivory:#FBF7F2;  --blush:#EFD9D5;  --rose:#D9B5B1;  --sage:#B8C3B0;
--gold:#C9A66B;   --rosegold:#B9827A; --cocoa:#403532; --white:#FFFDFC;
--haldi:#EBD69B;
```

There is also a gentle dark version for phones in dark mode, in the `prefers-color-scheme: dark` blocks just below.

### Other visual settings

| Change | File → where |
|---|---|
| Scratch-foil colours | `src/components/ScratchReveal.tsx` → `FOIL` |
| How much to scratch before it reveals | `ScratchReveal.tsx` → `REVEAL_AT` (0.5 = half) |
| Petal colours | `src/lib/fx.ts` → `PETAL_COLOURS` |
| Petal shower length and intensity | `ScratchReveal.tsx` → `reveal()`; `5200` is milliseconds |
| Fonts | `src/app/layout.tsx` (imports) + `globals.css` (`--serif`, `--sans`, `--script`, `--deva`) |

To swap a font, install it with `npm i @fontsource/<font-name>`. Then import it in `layout.tsx` and update the variable in `globals.css`.

### WhatsApp / social share preview

The title and description come from `src/app/layout.tsx` (`metadata`).

To add a preview image:
1. Put a 1200×630 JPG at `public/images/og.jpg`.
2. Add `images: ['/images/og.jpg']` inside `openGraph`.
3. Add `metadataBase: new URL('https://your-domain')` to `metadata`.

---

## 6. The experience, in order

1. **Cover.** The shloka appears, the Y ✦ P seal draws itself, then the names, the tagline and **Enter invitation**.
2. **Gatefold opens.** The cover parts and the music begins.
3. **Scratch card.** Scratch with finger or mouse.
   - Once half is scratched: the foil dissolves, there is a 0.5 s pause, then one petal, then a gentle shower, gold sparkles and a music swell.
   - "Reveal without scratching" is there for anyone who can't scratch.
4. **The rest unlocks:** countdown, story, memories, celebrations, venue and finale.
5. **Finale.** A last drift of petals, then the page settles.

---

## 7. Already handled

- **Mobile first.** Checked at 390 px phones and 1440 px desktop. Respects the iPhone notch and home bar.
- **Performance.** Static export with a ~120 KB first load. Petals and sparkles share one canvas that idles when empty. Lazy map and lazy photos.
- **Accessibility.** Keyboard navigation and visible focus rings. Screen-reader labels and alt text. Readable contrast. Fully usable without music.
- **Reduced motion.** "Reduce motion" on the guest's phone minimises animation and skips petals.
- **Countdown timezone.** It counts to 7 PM **India time** for guests anywhere in the world.

---

## 8. Troubleshooting

| Problem | Fix |
|---|---|
| `npm install` fails | Update Node.js to the current LTS from nodejs.org |
| Map is blank locally | Check `embedUrl` is the `src` value from "Embed a map". It always works once deployed. |
| Photo not showing | The path must start with `/images/` and match the file name exactly, including capitals |
| No sound on iPhone | Turn off silent mode; iPhones mute website audio when silenced |
| Error after editing config | A comma or quote is probably missing. The dev server shows the exact line. |

---

## 9. Before sending to guests

- [ ] Real photos with real `alt` text
- [ ] Exact Google Maps pin in `mapsUrl` and `embedUrl`
- [ ] Ganesha artwork (optional)
- [ ] Event times confirmed
- [ ] Tested on an iPhone and an Android phone
- [ ] Share preview image added (optional)

With love, Yash & Pranshu · #PraYas
