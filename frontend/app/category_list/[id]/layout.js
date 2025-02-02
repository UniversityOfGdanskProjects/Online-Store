'use client'

import '../../../styles/add_category.css'


export default function EditLayout({ children }) {
    return (
      <div className="Add_Category_Div_Layout">
        <section>
            { children }
        </section>
      </div>
    );
  }