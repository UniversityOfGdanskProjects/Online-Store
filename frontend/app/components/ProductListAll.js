import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProductList = ({ searchQuery, selectedCategory, minPrice, maxPrice, sortOrder }) => {
    const [products, setProducts] = useState([])
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/admin/get/product")
                if (!response.ok) {
                  throw new Error("Błąd podczas pobierania produktów")
                }
                const data = await response.json();
                setProducts(data)
              } catch (error) {
                console.error("Błąd:", error)
              }
        }
        fetchProducts()
    }, [])

    const filteredProducts = products
    .filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === null || product.category_id === selectedCategory) &&
        (minPrice === null || product.price >= minPrice) &&
        (maxPrice === null || product.price <= maxPrice)
    )
    .sort((a, b) => {
        if (sortOrder === "asc") return a.price - b.price;
        if (sortOrder === "desc") return b.price - a.price;
        return 0;
    });

    

      return (
        <div className="p-4">
          <div className="product_list_div">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="product" 
                onClick={() => router.push(`/product/${product.id}`)} 
                style={{ cursor: "pointer" }}
              >
                <img
                  src={product.image_url || "/placeholder.jpg"}
                  className="product_img"
                />
                <div className="sapn_layout">
                  <span className="product_name_list">{product.name}</span>
                  <span className="product_name_price">${product.price.toFixed(2)}</span>
                  <div className="button_layout">
                    <button className="add_to_cart_button">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
}

export default ProductList;