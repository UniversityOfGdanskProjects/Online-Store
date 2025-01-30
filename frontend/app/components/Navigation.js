import Link from 'next/link'

function Navigation() {
    return (
        <nav>
            <ul className='navigation'>
                <li><Link href="/login_page">Login</Link></li>
                <li><Link href='/registration_page'>Sing Up</Link></li>
            </ul>
        </nav>
    )
}

export default Navigation