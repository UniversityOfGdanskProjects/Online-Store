'use client'

import '../../../styles/product_details.css'

export default function RegistrationLayout({ children }) {
    return (
      <div className='ProductDetaillsDiv'>
        <section>
            { children }
        </section>
      </div>
    );
  }