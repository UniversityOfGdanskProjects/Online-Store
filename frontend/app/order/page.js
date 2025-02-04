'use client'

import { useCart } from '../components/CartProvider'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OrderPage() {
    const { cart, addToCart, removeFromCart, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleOrder = async () => {
        if (cart.length === 0) return alert('Your cart is empty!');

        setLoading(true);
        const userEmail = sessionStorage.getItem('email'); // W przyszłości podmień na rzeczywisty e-mail użytkownika

        const products = cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
        }));

        try {
            const response = await fetch('http://localhost:8000/api/user/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_email: userEmail, products })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Order placed successfully! Order ID: ${data.order_id}`);
                clearCart();
                router.push('/'); // Po zamówieniu przekieruj na stronę główną
            } else {
                alert(data.error || 'Failed to place order');
            }
        } catch (error) {
            alert('Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="order-container">
            <h1 className="order-title">Your Order</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="order-items">
                    {cart.map((item) => (
                        <div key={item.id} className="order-item">
                            <p>{item.name} - ${item.price} x {item.quantity}</p>
                            <div className="order-actions">
                                <button onClick={() => addToCart(item)}>+</button>
                                <button onClick={() => removeFromCart(item.id)}>-</button>
                            </div>
                        </div>
                    ))}
                    <h3 className='total_order'>Total: ${total.toFixed(2)}</h3>
                    <div className='order_buttons_layout'>
                        <button className="order-button" onClick={handleOrder} disabled={loading}>
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                        <Link href="/">
                            <button className="order-cancle">Canlce</button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
