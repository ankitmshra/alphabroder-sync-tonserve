import React from "react";
import styles from "../styles/Header.module.css";
import { Button } from "@saleor/macaw-ui";


interface SearchResultProps {
  searchData: any; // Update the type based on your actual data structure
}

const SearchResultProps: React.FC<SearchResultProps> = ({ searchData }) => {
    const staticBaseUrl = "https://www.alphabroder.com/media/hires/";
    const handleReloadPage = () => {
        window.location.reload();
      };
  return (
    <>
    <div onClick={handleReloadPage} className="searchBackBtn"> &#8592; Back to Home</div>
      
    
    <div className={styles.productCardSearch}>
          <img
              src="https://www.alphabroder.com/media/hires/1370155_57_z.jpg"
              alt={searchData.short_description}
              className={styles.productImage} />
          <h2>{searchData.short_description}</h2>
          <p>Brand: {searchData.brand_name}</p>
          <p>Category: {searchData.category}</p>
          <p>Description: {searchData.full_feature_description}</p>
      </div></>
  );
};

export default SearchResultProps;
