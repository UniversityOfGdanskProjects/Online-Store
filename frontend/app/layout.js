'use client'

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Navigation from './components/Navigation';
import CategoriesMenu from './components/CategoriesMenu';
import ProductList from './components/ProductListAll';
import '../styles/home_page.css'

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const hiddenNavigationPaths = ['/login_page', '/registration_page'];
  const hiddenCategoryMenu = ['/add_product', '/add_category', '/product_list', '/category_list', '/admin_home_page', '/product/[id]']

  const showMenu = !hiddenCategoryMenu.some(path => pathname.startsWith('/product/') || pathname === path);
  const showNavigation = !hiddenNavigationPaths.includes(pathname);
  
  return (
    <html lang="pl">
      <head />
      <body>
        <header>
          <img src='Logo.png' alt='Logo of my Website' />
          <div className='navigation'>
            { showMenu && showNavigation &&
              <input
                type="text"
                placeholder="Wyszukaj produkt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search_input"
              />
            } 
            {showNavigation && <Navigation />} 
          </div>
        </header>
        { showMenu && 
          <header className='menu_header'>
            <CategoriesMenu setSelectedCategory={setSelectedCategory} />
          </header>
        }
          <main>
            {children}
            <div className='product_list_layout_hp'>
              { showMenu && showNavigation &&
                <ProductList searchQuery={searchQuery} selectedCategory={selectedCategory} />
              }
            </div>
          </main>
      </body>
    </html>
  );
}