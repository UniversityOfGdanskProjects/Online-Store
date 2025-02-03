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
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sortOrder, setSortOrder] = useState("");

  const hiddenNavigationPaths = ['/login_page', '/registration_page'];
  const hiddenCategoryMenu = ['/add_product', '/add_category', '/product_list', '/category_list', '/admin_home_page', '/product/[id]', '/product_list/[id]', '/category_list/[id]']

  const showMenu = !hiddenCategoryMenu.some(path => 
    pathname.startsWith('/product/') || 
    pathname.startsWith('/category_list/') || 
    pathname.startsWith('/product_list/') || 
    pathname === path
  );
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
            <CategoriesMenu 
              setSelectedCategory={setSelectedCategory} 
              setMinPrice={setMinPrice} 
              setMaxPrice={setMaxPrice} 
              setSortOrder={setSortOrder} 
            />
          </header>
        }
          <main>
            {children}
            <div className='product_list_layout_hp'>
              { showMenu && showNavigation &&
                <ProductList 
                searchQuery={searchQuery} 
                selectedCategory={selectedCategory} 
                minPrice={minPrice} 
                maxPrice={maxPrice} 
                sortOrder={sortOrder} 
              />
              }
            </div>
          </main>
      </body>
    </html>
  );
}