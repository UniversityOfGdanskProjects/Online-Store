'use client'

import '../../styles/add_product.css'

export default function AddProductLayout({ children }) {
    return (
      <div className="Add_Product_Layout">
        <section>
            { children }
        </section>
      </div>
    );
  }