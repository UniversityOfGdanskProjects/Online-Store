'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';
import * as yup from 'yup'
import { Formik, Field, Form } from "formik";

const schema = yup.object().shape({
    rating: yup.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5").required("Product rating is required"),
    comment: yup.string().required("Product comment is required")
})

const ProductDetails = () => {
    const router = useRouter()
    const { id } = useParams()
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState()
    const [opinion, setOpinion] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)

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

            const response = await fetch(`http://localhost:8000/api/user/product/add/review/${id}`, {
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
            // fetchAllOpinions()

        } catch (error) {
            console.error('Error sending data to API:', error)
        }
        
    }

    

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
                    <p className="product-details__price">Cena: ${product.price.toFixed(2)}</p>
                    <p className="product-details__stock">Na stanie: {product.stock} szt.</p>
                    <div className="product-details_actions">
                        <button className="btn-add-to-cart">Add To Cart</button>
                        <button className="btn-go-back" onClick={() => router.push('/')}>Go Back</button>
                    </div>
                </div>
            </div>

            {!isLoggedIn ? (
                <div>
                    <p style={{ color: "red" }}>You must be logged in to add a review.</p>
                    <button onClick={() => router.push('/login_page')}>Login</button>
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
                        <Form>
                            <div>
                                <label>Comment</label>
                                <Field id="comment" name="comment" />
                                {errors.comment && touched.comment ? (
                                    <div>{errors.comment}</div>
                                ) : null}
                            </div>

                            <div>
                                <label>Rating</label>
                                <Field
                                    name="rating"
                                    component={StarRating}
                                />
                                {errors.rating && touched.rating ? (
                                    <div>{errors.rating}</div>
                                ) : null}
                            </div>

                            <button type="submit">Add Opinion</button>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default ProductDetails;