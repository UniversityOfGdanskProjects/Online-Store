'use client'
import '../../styles/registration_page.css'
export default function RegistrationLayout({ children }) {
    return (
      <div className="Registration_Page_Div_Layout">
        <section className="aaa">
            { children }
        </section>
      </div>
    );
  }