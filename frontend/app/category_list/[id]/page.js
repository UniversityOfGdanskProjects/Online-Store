'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from 'next/navigation';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';

const schema = yup.object().shape({
    name: yup.string().required("Category name is required"),
    parent: yup.string().nullable()
})

const EditCategoryPage = () => {
    const { id } = useParams()
    const router = useRouter()
    const [allCategories, setAllCategories] = useState([])
    const [categoryData, setCategoryData] = useState({
        name: '',
        parent_id: '',
    })

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const apiURL = `http://localhost:8000/api/admin/category/${id}`
                const response = await fetch(apiURL)

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`)
                }

                const data = await response.json()
                console.log("Received category data:", data);

                if (data) {
                    setCategoryData(data)
                } else {
                    alert('Category not found.')
                }
            } catch (error) {
                console.error('Error while fetching transaction data:', error)
            }
        }
        fetchCategory()
    }, [id])

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

    const onSubmit = async (data) => {
        try {
            const updatedCategory = {
                name: data.name,
                parent_id: data.parent === '' ? null : parseInt(data.parent) // Konwersja na liczbę lub null
            }

            console.log("Submitting data:", updatedCategory)

            const response = await fetch(`http://localhost:8000/api/admin/category/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCategory),
            })

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const result = await response.json();
            console.log('Category updated:', result);
        } catch (error) {
            console.error('Error while fetching transaction data:', error);
        }
        router.push('/category_list')
    }

    const getParentName = (parentId) => {
        const parentName = allCategories.find(category => category.id === parentId)
        return parentName ? parentName.name : null
    }

    const initialValues = {
        name: categoryData.name || '',
        parent: categoryData.parent_id ? String(categoryData.parent_id) : '',
    };

    return(
        <div className='Add_Category_Page_Div_Page'>
            <h1 className="add_category_welcome">Edit Category</h1>
            <Formik
            initialValues={initialValues}
            validationSchema={schema}
            enableReinitialize
            onSubmit={onSubmit}
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
                        <button 
                            type="button"
                            onClick={() => router.push('/category_list')}
                            className="category_list_button"
                        >
                            Cancel
                        </button>
                    </div>
                </Form>
                )}
            </Formik>
        </div>
    )
}


export default EditCategoryPage