'use client'
import '../../styles/category_list.css';

export default function LoginLayout({ children }) {
    return (
      <div className='ser_category_list'>
        <section>
            { children }
        </section>
      </div>
    );
  }