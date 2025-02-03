"use client"

import React, { useState, useEffect } from "react"

export default function CategoriesMenu({ setSelectedCategory, setMinPrice, setMaxPrice, setSortOrder }){
    const [categories, setCategories] = useState([])
    const [activeParent, setActiveParent] = useState(null)
    const [role, setRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPriceFilter, setShowPriceFilter] = useState(false);
    const [minPrice, setLocalMinPrice] = useState("");
    const [maxPrice, setLocalMaxPrice] = useState("");
    const [sortOrder, setLocalSortOrder] = useState("");

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

    const applyFilters = () => {
        setMinPrice(minPrice ? parseFloat(minPrice) : null);
        setMaxPrice(maxPrice ? parseFloat(maxPrice) : null);
        setSortOrder(sortOrder);
    };

    const clearFilters = () => {
        setLocalMinPrice("");
        setLocalMaxPrice("");
        setLocalSortOrder("");
        setMinPrice(null);
        setMaxPrice(null);
        setSortOrder("");
    };

    return(
        <div>
            {role !== 'admin' && (
                <>
                    <div className="Category_Menu_Div">
                        <button 
                            onClick={() => setSelectedCategory(null)}
                            className="px-4 py-2 border rounded bg-gray-200"
                        >
                            Wszystkie produkty
                        </button>
                        {parentCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setActiveParent(category.id === activeParent ? null : category.id);
                                    setSelectedCategory(category.id);
                                }}
                                className={`px-4 py-2 border rounded ${activeParent === category.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            >
                                {category.name}
                            </button>
                        ))}
                        <button 
                            onClick={() => setShowPriceFilter(!showPriceFilter)}
                            className="px-4 py-2 border rounded bg-green-500 text-white"
                        >
                            Filtruj
                        </button>
                    </div>
                    
                    {showPriceFilter && (
                        <div className="filter_section p-4 bg-gray-100 rounded mt-2">
                            <label className="block">Zakres cen:</label>
                            <div className="flex gap-2">
                                <input 
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setLocalMinPrice(e.target.value)}
                                    className="border p-2 w-20"
                                />
                                <input 
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                                    className="border p-2 w-20"
                                />
                            </div>

                            <label className="block mt-2">Sortowanie:</label>
                            <select 
                                value={sortOrder}
                                onChange={(e) => setLocalSortOrder(e.target.value)}
                                className="border p-2 w-full"
                            >
                                <option value="">Brak</option>
                                <option value="asc">Najtańsze</option>
                                <option value="desc">Najdroższe</option>
                            </select>

                            <div className="flex gap-2 mt-2">
                                <button onClick={applyFilters} className="px-4 py-2 bg-blue-500 text-white rounded">
                                    Zastosuj filtry
                                </button>
                                <button onClick={clearFilters} className="px-4 py-2 bg-red-500 text-white rounded">
                                    Wyczyść filtry
                                </button>
                            </div>
                        </div>
                    )}

                    {activeParent !== null && (
                        <div className="mt-4">
                        <ul className="list-disc pl-6">
                            {childCategories.map((sub) => (
                            <button 
                                key={sub.id} 
                                onClick={() => setSelectedCategory(sub.id)}
                            >
                                {sub.name}
                            </button>
                            ))}
                        </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    )
    
}