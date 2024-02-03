import React, { useState } from "react";
import { Box, Button } from "@saleor/macaw-ui";
import styles from "../styles/Header.module.css";
import ReactPaginate from "react-paginate";

interface Product {
  front_image: string;
  product_number: string;
  short_description: string;
  brand_name: string;
  category: string;
  full_feature_description: string;
  price_range:any;
}

interface ProductGridProps {
  products: Product[];
  prodprev:any;
  prodnext:any;
}

const truncateDescription = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const staticBaseUrl = "https://www.alphabroder.com/media/hires/";

const ProductGridComponent: React.FC<ProductGridProps> = ({ products,prodprev ,prodnext}) => {
  console.log(prodprev);
  console.log(prodprev);

  const itemsPerPage = 25; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const pageCount = Math.ceil(products.length / itemsPerPage);

  return (
    <div>
      <div className={styles.productGrid}>
        {currentProducts.map((product) => (
          <div key={product.product_number} className={styles.productCard}>
            <img
              src={`${staticBaseUrl}${product.front_image}`}
              alt={product.short_description}
              className={styles.productImage}
            />
            <h2>{product.short_description}</h2>
            <p><b>Price:</b> $ {product.price_range.min_price} - $ {product.price_range.max_price}</p>

            <p>
              <b>Item No:</b> {product.product_number}
            </p>
            <p>
              <b>Category:</b> {product.category}
            </p>
            <p>{truncateDescription(product.full_feature_description, 80)}</p>
              <div className="prodButton ">
                <Button>View Product</Button>
                <Button>Export Product</Button>
              </div>
          </div>
        ))}
        
      </div>

    </div>
  );
};

export default ProductGridComponent;
