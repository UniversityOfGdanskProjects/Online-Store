'use client'

import { usePathname } from 'next/navigation';
import Navigation from './components/Navigation';
import '../styles/home_page.css'

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hiddenNavigationPaths = ['/login_page', '/registration_page'];

  const showNavigation = !hiddenNavigationPaths.includes(pathname);
  
  return (
    <html lang="pl">
      <head />
      <body>
        <header>
          <img src='Logo.png' alt='Logo of my Website' />
          {showNavigation && <Navigation />} 
        </header>
          <main>{children}</main>
      </body>
    </html>
  );
}