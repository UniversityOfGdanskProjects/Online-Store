'use client'

import { usePathname } from 'next/navigation';
import Navigation from './components/Navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hiddenNavigationPaths = ['/login_page', '/registration_page'];

  const showNavigation = !hiddenNavigationPaths.includes(pathname);
  
  return (
    <html lang="pl">
      <head />
      <body>
        <header>
          {showNavigation && <Navigation />} 
        </header>
          <main>{children}</main>
      </body>
    </html>
  );
}