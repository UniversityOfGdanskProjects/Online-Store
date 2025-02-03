'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';

const ProductDetails = () => {
    const router = useRouter()
    const { id } = useParams()
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchProductDetails = async () => {
            try{
                const response = await fetch(`http://localhost:8000/api/admin/product/${id}`)
                if (!response.ok) {
                    throw new Error("Błąd pobierania szczegółów produktu");
                }
                const data = await response.json();
                setProduct(data);
            }catch (error) {
                console.error("Błąd:", error);
            }
        }
        fetchProductDetails();
    }, [id]);

    if (!product) {
        return <p>Ładowanie...</p>;
    }

    return (
        <div className="product-details">
            <h1 className="product-details__name">{product.name}</h1>
            <div className="product-details__layout">
                <div className="product-details__image-container">
                    <img 
                        src={product.image_url || "/placeholder.jpg"} 
                        className="product-details__image" 
                    />
                </div>
                <div className="product-details__info">
                    <p className="product-details__description">{product.description}</p>
                    <p className="product-details__price">Cena: ${product.price.toFixed(2)}</p>
                    <p className="product-details__stock">Na stanie: {product.stock} szt.</p>
                    <div className="product-details_actions">
                        <button className="btn-add-to-cart">Add To Cart</button>
                        <button className="btn-go-back" onClick={() => router.push('/')}>Go Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;