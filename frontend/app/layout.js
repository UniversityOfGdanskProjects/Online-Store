'use client'

import { usePathname } from 'next/navigation';
import Navigation from './components/Navigation';
import CategoriesMenu from './components/CategoriesMenu';
import '../styles/home_page.css'

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hiddenNavigationPaths = ['/login_page', '/registration_page'];
  const hiddenCategoryMenu = ['/add_product', '/add_category', '/product_list', '/category_list', '/admin_home_page']

  const showMenu = !hiddenCategoryMenu.includes(pathname)
  const showNavigation = !hiddenNavigationPaths.includes(pathname);
  
  return (
    <html lang="pl">
      <head />
      <body>
        <header>
          <img src='Logo.png' alt='Logo of my Website' />
          {showNavigation && <Navigation />} 
        </header>
        { showMenu && 
          <header className='menu_header'>
            <CategoriesMenu />
          </header>
        }
          <main>{children}</main>
      </body>
    </html>
  );
}