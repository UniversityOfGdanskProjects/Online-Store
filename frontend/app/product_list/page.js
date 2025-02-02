'use client'

import React, { useEffect, useState } from "react"
import Link from 'next/link'

const ProductListPage = () => {
    const [ allCategories, setAllCategories ] = useState([])
    const [ allProducts, setAllProducts ] = useState([])

    const fetchAllProducts = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/admin/get/product')
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            
            const result = await response.json()
            console.log("Fetched products:", result)

            setAllProducts(result) 
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

    useEffect(() => {
        fetchAllProducts()
    }, [])

    const fetchAllCategories = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/admin/get/category')
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
            
            const result = await response.json()
            console.log("Fetched categories:", result)

            setAllCategories(result) 
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    useEffect(() => {
        fetchAllCategories()
    }, [])

    const getCategoryName = (category_id) => {
        const categoryName = allCategories.find(category => category.id === category_id)
        return categoryName ? categoryName.name : null

    }

    const handleDelete = async (product_id) => {
        try{
            const response = await fetch(`http://localhost:8000/api/admin/product/${product_id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);

            setAllProducts((prevProduct) =>
                prevProduct.filter((product) => product.id !== product_id)
            );
        } catch (error) {
            console.error('Error while deleting transaction:', error);
        }
    }

    return(
        <div className="Product_List_Page">
            <h1 className="Product_List_Welcome">Product List</h1>
            <div className="product_list">
                <ul className="product_table">
                    <li className="product_header">
                        <p>Product</p>
                        <p>Description</p>
                        <p>Price</p>
                        <p>Stock</p>
                        <p>Category</p>
                        <p>Image URL</p>
                        <p>Date</p>
                    </li>
                    {allProducts.map((product) => (
                        <li key={product.id} className="table_row">
                            <p>{product.name}</p>
                            <p>{product.description}</p>
                            <p>{product.price}</p>
                            <p>{product.stock}</p>
                            <p>{getCategoryName(product.category_id)}</p>
                            <p>{product.image_url}</p>
                            <p>{product.created_at}</p>
                            <div className="actions">
                                <button onClick={() => handleDelete(product.id)}>Delete</button>
                                <Link href={`/product_list/${product.id}`}>
                                    <button>Edit</button>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className='button_div'>
                    <Link href='/add_product'>
                        <button className='add_button'>+</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProductListPage