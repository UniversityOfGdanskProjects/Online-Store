'use client'

import { useCart } from './CartProvider'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react';
import { useRouter } from "next/navigation"

export default function Cart() {
    const { cart, removeFromCart, total } = useCart();
    const [ isOpen, setIsOpen ] = useState(false)
    const router = useRouter()

    return (
        <div className="cart-wrapper" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <div className="cart-icon">
                <ShoppingCart size={20} color="#a54912" />
                {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </div>
            {isOpen && (
                <div className="cart-dropdown">
                    <h2 className="cart-title">Cart</h2>
                    {cart.length === 0 ? (
                        <p className="cart-empty">Your cart is empty</p>
                    ) : (
                        <div className="cart-items">
                            {cart.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <p className="cart-item-text">
                                        {item.name} - ${item.price} x {item.quantity}
                                    </p>
                                    <button className="cart-remove-button" onClick={() => removeFromCart(item.id)}>
                                        Delete
                                    </button>
                                </div>
                            ))}
                            <h3 className="cart-total">Total: ${total}</h3>
                            <button className='order' onClick={() => router.push('/order')}>Order</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
