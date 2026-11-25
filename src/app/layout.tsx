import type { Metadata, Viewport } from 'next';
import { Schibsted_Grotesk, Spline_Sans_Mono } from 'next/font/google';
import { ToastProvider } from '@/components/ui/Toast';
import './globals.css';

// Interface em Schibsted Grotesk; valores, datas e rótulos em Spline Sans Mono,
// com algarismos de largura fixa que se alinham em coluna, como num extrato.
const sans = Schibsted_Grotesk({
  variable: '--font-schibsted',
  subsets: ['latin'],
});

const mono = Spline_Sans_Mono({
  variable: '--font-spline-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: { default: 'Finanças Pessoais', template: '%s | Finanças Pessoais' },
  description: 'Sistema web de organização financeira pessoal.',
};

export const viewport: Viewport = {
  themeColor: '#eef2ec',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable} h-full`}>
      <body className="min-h-full">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
