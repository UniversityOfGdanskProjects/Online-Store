'use client'

import React, { useEffect, useState } from "react"
import * as yup from "yup"
import { Formik, Field, Form } from "formik"
import Link from 'next/link'

const schema = yup.object().shape({
    name: yup.string().required("Product name is required"),
    description: yup.string().required("Product description is required"),
    price: yup.number().required("Product price is required").positive(),
    stock: yup.number().required("Stock of product is required ").positive(),
    category: yup.string().required("Product category is required"),
    image_url: yup.string().required("Product image is required"),
    created_at: yup.date().required('The date is required.')
})

const AddProductPage = () => {
    const [allCategories, setAllCategories] = useState([])

    async function SendJsonToApi(data, { resetForm }) {
        try{
            const payload = {
                name: data.name,
                descriptors: data.description,
                price: data.price,
                stock: data.stock,
                category_id: data.category,
                image_url: data.image_url,
                created_at: data.created_at
            }

            console.log("Sending to API:", payload)

            const response = await fetch('http://localhost:8000/api/admin/product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            console.log(result)

            resetForm()
            fetchAllCategories()
        } catch (error) {
            console.error('Error sending data to API:', error)
        }
    }

    const fetchAllCategories = async () => {
        try{
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

    return(
        <div className="Add_Product_Page_Div_Page">
            <h1 className="add_product_welcome">Add Product</h1>
            <Formik
                initialValues={{
                    name: "",
                    description: "",
                    price: "",
                    stock: "",
                    category: "",
                    image_url: "",
                    created_at: ""
                }}
                validationSchema={schema}
                onSubmit={SendJsonToApi}
            >
                {({ errors, touched, setFieldValue }) => (
                    <Form className="add_product_formik">
                        <div className="add_product_name">
                            <label className="add_product_name_label">Product Name</label>
                            <Field id="name" name="name" className="add_product_name_field"/>
                            {errors.name && touched.name ? (
                                <div className="add_product_name_error">{errors.name}</div>
                            ) : null}
                        </div>

                        <div className="add_product_description">
                            <label className="add_product_description_label">Description</label>
                            <Field id="description" name="description" className="add_product_description_field"/>
                            {errors.description && touched.description ? (
                                <div className="add_product_description_error">{errors.description}</div>
                            ) : null}
                        </div>
                        <div className="add_product_price">
                            <label className="add_product_price_label">Product Price</label>
                            <Field id="price" name="price" className="add_product_price_field"/>
                            {errors.price && touched.price ? (
                                <div className="add_product_price_error">{errors.price}</div>
                            ) : null}
                        </div>
                        <div className="add_product_stock">
                            <label className="add_product_stock_label">Stock</label>
                            <Field id="stock" name="stock" className="add_product_stock_field"/>
                            {errors.stock && touched.stock ? (
                                <div className="add_product_stock_error">{errors.stock}</div>
                            ) : null}
                        </div>
                        <div className="add_product_category">
                            <label className="add_product_category_layout">Category</label>
                            <Field
                                as="select"
                                id="category"
                                name="category"
                                onChange={(e) => setFieldValue("category", e.target.value)}
                            >
                                {allCategories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Field>
                            {errors.category && touched.category ? (<div>{errors.category}</div>) : null}
                        </div>
                        <div className="add_product_img">
                            <label className="add_product_img_label">Image URL</label>
                            <Field id="image_url" name="image_url" className="add_product_img_field" />
                            {errors.image_url && touched.image_url ? (
                                <div className="add_product_img_error">{errors.image_url}</div>
                            ) : null}
                        </div>
                        <div className="add_product_date">
                            <label htmlFor="date" className="add_product_date_label" >Create date</label>
                            <Field id="created_at" name="created_at" type="date" className="add_product_date_field"/>
                            {errors.created_at && touched.created_at ? (
                                <div className="add_product_date_error">{errors.created_at}</div>
                            ) : null}
                        </div>

                        <div className="button_layout_add_product">
                            <button type="submit" className="add_product_button">Add Product</button>
                            <Link href="product_list">
                                <button className="product_list_button">Go To List</button>
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddProductPage