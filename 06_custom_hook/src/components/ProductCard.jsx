import { FaShoppingCart } from "react-icons/fa";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <button onClick={() => onAddToCart(product)}>
        <FaShoppingCart /> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
