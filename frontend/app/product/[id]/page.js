'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';
import { useCart } from "../../components/CartProvider";
import * as yup from 'yup'
import { Formik, Field, Form } from "formik";

const schema = yup.object().shape({
    rating: yup.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5").required("Product rating is required"),
    comment: yup.string().required("Product comment is required")
})

const ProductDetails = () => {
    const router = useRouter()
    const { id } = useParams()
    const cleanId = id.trim(); 
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState()
    const [opinion, setOpinion] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const email = sessionStorage.getItem('email');
            setIsLoggedIn(email !== null);
        }
    }, [])

    async function SendJsonToApi(data, { resetForm }) {
        try {
            const payload = {
                user_email: sessionStorage.getItem('email'),
                rating: data.rating,
                comment: data.comment
            }

            console.log("Sending to API:", payload)

            const response = await fetch(`http://localhost:8000/api/user/product/add/review/${cleanId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = await response.json()
            console.log(result)

            resetForm()
            fetchAllOpinions()
            fetchRating()
        } catch (error) {
            console.error('Error sending data to API:', error)
        }
        
    }

    const fetchRecommendedProducts = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/admin/get/product`);
            if (!response.ok) {
                throw new Error("Błąd pobierania produktów z tej samej kategorii");
            }
            const data = await response.json();
            setRecommendedProducts(data.filter(product => product.id !== cleanId).slice(0, 3)); // Pobierz 3 produkty, z wyjątkiem obecnego
        } catch (error) {
            console.error("Błąd:", error);
        }
    };

    const fetchAllOpinions = async () => {
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/user/product/get/opinions/${cleanId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            })

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            
            const result = await response.json()
            console.log("Fetched opinions:", result)
    
            setOpinion(result) 
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

    const fetchRating = async () => {
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/user/product/get/rating/${cleanId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            })

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            
            const result = await response.json()
            console.log("Fetched rating:", result)
    
            setRating(result) 
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

    useEffect(() => {
        fetchRating()
        fetchAllOpinions()
    }, [])

    

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

                fetchRecommendedProducts(data.category_id);
            }catch (error) {
                console.error("Błąd:", error);
            }
        }
        fetchProductDetails();
    }, [id]);

    if (!product) {
        return <p>Ładowanie...</p>;
    }

    const StarRating = ({ field, form, ...props }) => {
        const { setFieldValue } = form;
        const handleClick = (rating) => {
            setFieldValue(field.name, rating);
        };
    
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    onClick={() => handleClick(i)}
                    style={{
                        cursor: "pointer",
                        color: i <= field.value ? "gold" : "gray",
                        fontSize: "24px"
                    }}
                >
                    ★
                </span>
            );
        }
    
        return <div>{stars}</div>;
    };

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
                    <p className="product-details__price">
                        Cena: ${product.price.toFixed(2)} 
                        {rating && <span> | Ocena: {rating}</span>}
                    </p>
                    <p className="product-details__stock">Na stanie: {product.stock} szt.</p>
                    <div className="product-details_actions">
                        <button className="btn-add-to-cart" onClick={() => {
                            const userEmail = sessionStorage.getItem("email");
                            if (!userEmail) {
                              alert("Musisz się zalogować, aby dodać produkt do koszyka!");
                             return;
                            }
                            addToCart(product)
                        }}
                        >
                            Add To Cart
                        </button>
                        <button className="btn-go-back" onClick={() => router.push('/')}>Go Back</button>
                    </div>
                </div>
            </div>
    
            {recommendedProducts.length > 0 && (
                <div className="recommended-products">
                    <h2>Recommended products:</h2>
                    <div className="recommended-products__list">
                        {recommendedProducts.map((product) => (
                            <div 
                                key={product.id} 
                                className="recommended-product" 
                                onClick={() => router.push(`/product/${product.id}`)} 
                                style={{ cursor: "pointer" }}
                            >
                                <img
                                    src={product.image_url || "/placeholder.jpg"}
                                    className="recommended-product-img"
                                />
                                <div className="recommended-product-info">
                                    <span className="recommended-product-name">{product.name}</span>
                                    <span className="recommended-product-price">${product.price.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
    
            {!isLoggedIn ? (
                <div className="login-prompt">
                    <p className="login-prompt__message">You must be logged in to add a review.</p>
                    <button onClick={() => router.push('/login_page')} className="btn-go-back">Login</button>
                </div>
            ) : (
                <Formik
                    initialValues={{
                        comment: "",
                        rating: ""
                    }}
                    validationSchema={schema}
                    onSubmit={SendJsonToApi}
                >
                    {({ errors, touched }) => (
                        <Form className="review-form">
                            <div className="review-form__field">
                                <label htmlFor="comment">Comment</label>
                                <Field id="comment" name="comment" />
                                {errors.comment && touched.comment && (
                                    <div className="error-message">{errors.comment}</div>
                                )}
                            </div>
    
                            <div className="review-form__field">
                                <label>Rating</label>
                                <Field
                                    name="rating"
                                    component={StarRating}
                                />
                                {errors.rating && touched.rating && (
                                    <div className="error-message">{errors.rating}</div>
                                )}
                            </div>
    
                            <button type="submit" className="btn-add-to-cart">Add Opinion</button>
                        </Form>
                    )}
                </Formik>
            )}
    
            <div className="product-details__opinions">
                <h2>Opinions:</h2>
                {opinion.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    opinion.map((op, index) => (
                        <div key={index} className="product-details__opinion">
                            <p><strong>{op.user_name}</strong></p>
                            <p>Rating: {op.rating}</p>
                            <p>{op.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );    
}    

export default ProductDetails;