'use client'

import React, { useEffect, useState } from "react"
import * as yup from "yup"
import { Formik, Field, Form } from "formik";
import Link from 'next/link'

const schema = yup.object().shape({
    name: yup.string().required("Category name is required"),
    paretn: yup.string().nullable()
})

const AddCategoryPage = () => {

    const [allCategories, setAllCategories] = useState([])

    async function SendJsonToApi(data, { resetForm }) {
        try{
            const payload = { 
                name: data.name, 
                parent_id: data.parent || null 
            }

            console.log("Sending to API:", payload)

            const response = await fetch('http://localhost:8000/api/admin/category', {
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
            fetchAllCategories()
        } catch (error) {
            console.error('Error sending data to API:', error)
        }
    }

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

    return(
        <div className='Add_Category_Page_Div_Page'>
            <h1 className="add_category_welcome">Add Category</h1>
            <Formik
                initialValues={{
                    name: "",
                    parent: ""
                }}
                validationSchema={schema}
                onSubmit={SendJsonToApi}
            >
                {({ errors, touched, setFieldValue }) => (
                    <Form className="add_category_formik">
                        <div className="add_category_name">
                            <label className="add_category_name_layout">Category Name</label>
                            <Field id="name" name="name" className="add_category_name_field" />
                            {errors.name && touched.name ? (
                                <div className="add_category_name_error" >{errors.name}</div>
                            ) : null}
                        </div>

                        <div className="add_category_parent">
                            <label className="add_category_parent_layout">Parent</label>
                            <Field 
                                as="select" 
                                id="parent" 
                                name="parent"
                                onChange={(e) => setFieldValue("parent", e.target.value)}
                            >
                                <option value="">None</option>
                                {allCategories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Field>
                            {errors.parent && touched.parent && <div>{errors.parent}</div>}
                        </div>

                        <div className="button_layout_add_category">
                            <button type="submit" className="add_category_button">Add Category</button>
                            <Link href="category_list">
                                <button className="category_list_button">Go To List</button>
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddCategoryPage