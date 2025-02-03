"use client"

import React, { useState, useEffect } from "react"

export default function CategoriesMenu(){
    const [categories, setCategories] = useState([])
    const [activeParent, setActiveParent] = useState(null)
    const [role, setRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const email = sessionStorage.getItem('email');
        const userRole = sessionStorage.getItem('role');

        if (email) {
            setIsLoggedIn(true);
            setRole(userRole);
        }

        const handleStorageChange = () => {
            const email = sessionStorage.getItem('email');
            const userRole = sessionStorage.getItem('role');

            setIsLoggedIn(!!email);
            setRole(userRole);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [])

    useEffect(() => {
        async function fetchCategories() {
          try {
            const res = await fetch("http://localhost:8000/api/admin/get/category");
            const data = await res.json();
            setCategories(data);
          } catch (error) {
            console.error("Błąd ładowania kategorii", error);
          }
        }
    
        fetchCategories();
    }, []);

    const parentCategories = categories.filter((cat) => cat.parent_id === null);
    const childCategories = categories.filter((cat) => cat.parent_id === activeParent);

    return(
        <div>
            {role !== 'admin' && (
                <>
                    <div className="Category_Menu_Div">
                        {parentCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveParent(category.id === activeParent ? null : category.id)}
                                className={`px-4 py-2 border rounded ${activeParent === category.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                    {activeParent !== null && (
                        <div className="mt-4">
                        <ul className="list-disc pl-6">
                            {childCategories.map((sub) => (
                            <button key={sub.id}>{sub.name}</button>
                            ))}
                        </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    )
    
}