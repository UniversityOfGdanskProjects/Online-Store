import { useEffect, useState } from "react";

const ProductList = () => {
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

    return (
        <div className="product_list_div">
          {products.map((product) => (
            <div key={product.id} className="product">
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
      );
}

export default ProductList;