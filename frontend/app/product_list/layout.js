'use client'

import '../../styles/product_list.css'

export default function ProductListLayout({ children }) {
    return (
      <div className='product_list_layout'>
        <section>
            { children }
        </section>
      </div>
    );
  }