import type { Metadata, Viewport } from 'next';
import '@fontsource/bodoni-moda/400.css';
import '@fontsource/bodoni-moda/500.css';
import '@fontsource/bodoni-moda/400-italic.css';
import '@fontsource/jost/300.css';
import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import '@fontsource/pinyon-script/400.css';
import '@fontsource/tiro-devanagari-sanskrit/400.css';
import './globals.css';
import { wedding } from '@/config/wedding';

const { couple, date } = wedding;
export const metadata: Metadata = {
  title: `${couple.first[0]} ♥ ${couple.first[1]} · ${couple.hashtag} · ${date.displayDate}`,
  description: `You are invited to the wedding of ${couple.groom} and ${couple.bride}, ${date.displayDate}.`,
  openGraph: {
    title: `${couple.first[0]} ♥ ${couple.first[1]} · ${couple.hashtag}`,
    description: `You are invited · ${date.displayDate}`,
  },
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🪷</text></svg>" },
};
export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#FBF7F2',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="js is-closed" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
