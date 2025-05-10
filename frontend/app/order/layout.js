'use client'

import '../../styles/order.css'

export default function OrderLayout({ children }) {
    return (
      <div>
        <section>
            { children }
        </section>
      </div>
    );
  }