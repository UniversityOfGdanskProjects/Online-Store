import { useEffect, useState } from "react";

const ProductList = ({ searchQuery, selectedCategory }) => {
    const [products, setProducts] = useState([])

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

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === null || product.category_id === selectedCategory)
    )
    

      return (
        <div className="p-4">
          <div className="product_list_div">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product">
                <img
                  src={product.image_url || "/placeholder.jpg"}
                  className="product_img"
                  alt={product.name}
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