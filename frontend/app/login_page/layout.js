'use client'
import '../../styles/login_page.css'

export default function LoginLayout({ children }) {
    return (
      <div className="Login_Page_Div_Layout">
        <section>
            { children }
        </section>
      </div>
    );
  }