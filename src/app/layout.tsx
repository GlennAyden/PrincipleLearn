// src/app/layout.tsx
import './globals.scss';
import './font-styles.scss';
import { ReactNode } from 'react';
import { RequestCourseProvider } from '../context/RequestCourseContext';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <RequestCourseProvider>
          {children}
        </RequestCourseProvider>
      </body>
    </html>
  );
}
