'use client'
import { actions, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Box, Button, Input, Text } from "@saleor/macaw-ui";
import { NextPage } from "next";
import Link from "next/link";
import { MouseEventHandler, useEffect, useState } from "react";
import styles from '../styles/Header.module.css';



const AddToSaleorForm = () => (
  <Box
    as={"form"}
    display={"flex"}
    alignItems={"center"}
    gap={4}
    onSubmit={(event) => {
      event.preventDefault();

      const saleorUrl = new FormData(event.currentTarget as HTMLFormElement).get("saleor-url");
      const manifestUrl = new URL("/api/manifest", window.location.origin);
      const redirectUrl = new URL(
        `/dashboard/apps/install?manifestUrl=${manifestUrl}`,
        saleorUrl as string
      ).href;

      window.open(redirectUrl, "_blank");
    }}
  >
    <Input type="url" required label="Saleor URL" name="saleor-url" />
    <Button type="submit">Add to Saleor</Button>
  </Box>
);

/**
 * This is page publicly accessible from your app.
 * You should probably remove it.
 */
interface Product {
  product_number: string;
  short_description: string;
  brand_name: string;
  category: string;
  full_feature_description: string;
  // Add other properties as needed
}
const IndexPage: NextPage = () => {
  const { appBridgeState, appBridge } = useAppBridge();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<Product[]>([]);
  const [showComponent, setShowComponent] = useState(true); // New state variable
  const [errorMessage, setErrorMessage] = useState<string | null>(null);






  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);
 

  const handleLinkClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    /**
     * In iframe, link can't be opened in new tab, so Dashboard must be a proxy
     */
    if (appBridgeState?.ready) {
      e.preventDefault();

      appBridge?.dispatch(
        actions.Redirect({
          newContext: true,
          to: e.currentTarget.href,
        })
      );
    }

    /**
     * Otherwise, assume app is accessed outside of Dashboard, so href attribute on <a> will work
     */
  };

  const isLocalHost = global.location.href.includes("localhost");

  const handleSearch = () => {
    setLoading(true);
  
    fetch(`http://alpapi.tonserve.com/api/${searchTerm}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Search results:', data);
  
        setSearchResults(data);
        setProductData(data.results || []);
  
        setLoading(false);
        setShowComponent(false);
      })
      .catch(error => {
        setLoading(false);
        setSearchResults([]);
        console.error('Error fetching data:', error);
        // You can handle the error here, for example, display an error message to the user
        // or perform any other action you see fit.
      });
  };
  

  const fetchProducts = () => {
    // Set loading to true while fetching data
    setLoading(true);

    // Perform the fetch request for the product grid
    fetch('http://alpapi.tonserve.com/api/products/?page=5&page_size=10', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // Handle the product grid data as needed
        console.log('Product grid data:', data);

        // Update search results state
        setProductData(data.results || []); // Assuming the products are in the 'results' property
      })
      .catch(error => {
        setLoading(false);
        console.error('Error fetching product grid data:', error);
      })
      .finally(() => {
        // Set loading to false after fetch completes
        setLoading(false);
      });
  };

  return (
    <Box padding={8}>
      <header className={styles.header}>
        <h1>Alphabroder</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch} className={styles.searchButton}>Search</button>
        </div>
      </header>

      {loading && <p>Loading...</p>}

{!loading && searchResults.length != 0  && (
  <div>
   
      <div key={searchResults.product_number}>
        <h2>{searchResults.short_description}</h2>
        <p>Brand: {searchResults.brand_name}</p>
        <p>Category: {searchResults.category}</p>
        <p>Description: {searchResults.full_feature_description}</p>
      </div>
 
  </div>
)}

{showComponent && !loading && productData.length != 0 && (
        // Render the product grid
        <div className={styles.productGrid}>
          {productData.map((product: Product) => (
            <div  key={product.product_number} className={styles.productCard}>
              <h2>{product.short_description}</h2>
              <p>Brand: {product.brand_name}</p>
              <p>Category: {product.category}</p>
              {/* Add more information as needed */}
            </div>
          ))}
        </div>
      )}



  
</Box>
  );
};

export default IndexPage;
