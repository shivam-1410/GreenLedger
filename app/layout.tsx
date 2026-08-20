import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { TransactionTracker } from '@/components/tx-tracker';
import { AnimatedBackground } from '@/components/animated-background';
import { RouteTransition } from '@/components/route-transition';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'GreenLedger | Stellar Soroban Carbon Credit Protocol',
  description:
    'Decentralized carbon credit marketplace, verified credit minting, and offset retirement tracking powered by Stellar Soroban smart contracts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans min-h-screen flex flex-col relative bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950`}
        suppressHydrationWarning
      >
        <AnimatedBackground />
        <Navbar />
        <RouteTransition>
          <main className="flex-1">{children}</main>
        </RouteTransition>
        <Footer />
        <TransactionTracker />
        <Toaster position="bottom-left" theme="dark" richColors />
      </body>
    </html>
  );
}
