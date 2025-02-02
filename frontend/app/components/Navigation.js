'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function Navigation() {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = () => {
            const email = sessionStorage.getItem('email');
            setIsLoggedIn(!!email);
        };
        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);
        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('email');
        setIsLoggedIn(false)
        router.push('/');
    }
    return (
        <nav>
            <ul className='navigation'>
                <li>
                    <Link href="/add_product">Add Product</Link>
                </li>
                <li>
                    <Link href="/add_category">Add Category</Link>
                </li>
                <li>
                    <Link href="/category_list">Category List</Link>
                </li>
                {!isLoggedIn ? (
                    <li>
                        <div className='login_registration_buttons'>
                            <Link href="/login_page"><button className='login_button_hp'>Login</button></Link>
                            <Link href='/registration_page'><button className='register_button'>Sign Up</button></Link>
                        </div>
                    </li>
                ) : (
                    <li>
                        <div className='sing_out_buttons'>
                            <button className='home_page_sign_out_button' onClick={handleLogout}>Sign Out</button>
                        </div>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default Navigation