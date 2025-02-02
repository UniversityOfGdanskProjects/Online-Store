'use client'

import React, { useEffect, useState } from "react"
import Link from 'next/link'

const CategoryList = () => {
    const [ allCategories, setAllCategories ] = useState([])

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

     const getParentName = (parentId) => {
        const parentName = allCategories.find(category => category.id === parentId)
        return parentName ? parentName.name : null
    }

    const handleDelete = async (category_id, parent_id = null) => {
        try {

            const categoryToDelete = allCategories.find(cat => cat.id === category_id);

            if (categoryToDelete) {
                const subCategories = allCategories.filter(cat => cat.parent_id === category_id);
                for (const sub of subCategories) {
                    await handleDelete(sub.id); 
                }
            }
            const response = await fetch(`http://localhost:8000/api/admin/category/${category_id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);

            setAllCategories((prevCategory) =>
                prevCategory.filter((category) => category.id !== category_id)
            );

        } catch (error) {
            console.error('Error while deleting transaction:', error);
        }
    };

    return(
        <div className='Category_List_Page'>
            <h1 className="Category_List_Welcom">Category List</h1>
            <div className="category_list">
                <ul className="category_table">
                    <li className="category_header">
                        <p>Category</p>
                        <p>Parent</p>
                    </li>
                    {allCategories.map((category) => (
                        <li key={category.id} className="table_row">
                            <p>{category.name}</p>
                            <p>{getParentName(category.parent_id)}</p>
                            <div className="actions">
                            <button onClick={() => handleDelete(category.id, category.parentId)}>Delete</button>
                            <Link href='/category_list'>
                                <button>Edit</button>
                            </Link>
                        </div>
                        </li>
                    ))}
                </ul>
                <div className='button_div'>
                <Link href='/add_category'>
                    <button className='add_button'>+</button>
                </Link>
            </div>
            </div>
        </div>
    )
}

export default CategoryList