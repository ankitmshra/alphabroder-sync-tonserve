'use client'
import { actions, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Box, Button, Input, Text } from "@saleor/macaw-ui";
import { NextPage } from "next";
import Link from "next/link";
import { MouseEventHandler, useEffect, useState } from "react";
import styles from '../styles/Header.module.css';
import ProductGridComponent from "../components/ProductGridProps";
import SearchBarComponent from "../components/SearchBarComponent";
import SearchResultProps from "../components/SearchResultProps";



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

interface Product {
  product_number: string;
  short_description: string;
  brand_name: string;
  category: string;
  full_feature_description: string;
  front_image: string;
  price_range:any;

  // Add other properties as needed
}

const IndexPage: React.FC = () => {
  const { appBridgeState, appBridge } = useAppBridge();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<Product[]>([]);
  const [searchData, setSearchData] = useState<any>([]);
  const [showComponent, setShowComponent] = useState(true);
  const [searchRes,SetSearchRes] = useState(false);
  const [prodPrev, SetProdPrev] = useState<any>([]);
  const [prodNext, SetProdNext] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1); // Initial page number


  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, [currentPage]);

  const handleSearch = (searchTerm: string) => {
    setLoading(true);

    fetch(`http://alpapi.tonserve.com/api/${searchTerm}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Search results:", data);
        setSearchData(data);
        setLoading(false);
        setShowComponent(false);
     
      })
      .catch((error) => {
        setLoading(false);
        setSearchData([]);
        SetSearchRes(true);
        console.error("Error fetching data:", error);
      });
  };

  const fetchProducts = () => {
    setLoading(true);

    const apiUrl = `http://alpapi.tonserve.com/api/products/?page=${currentPage}&page_size=25`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Product grid data:", data);
        setProductData(data.results || []);
      })
      .catch((error) => {
        console.error("Error fetching product grid data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Ensure not to go below page 1
  };

  return (
    <Box padding={8}>
      <header className={styles.header}>
        <h1>Alphabroder</h1>
        <SearchBarComponent onSearch={handleSearch} />
      </header>

      {loading && showComponent && <p>Loading...</p>}

      {!loading && searchData.length != 0  &&  (
      <SearchResultProps searchData={searchData} />
      )}

      {showComponent && !loading && productData.length !== 0 && (
        <ProductGridComponent products={productData} prodprev={prodPrev} prodnext={prodNext}/>
      )}
       {showComponent && !loading && productData.length !== 0 && (
          <div className="prodPagination ">
          <Button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button onClick={handleNextPage}>Next</Button>
        </div>
      )}
    
    </Box>
  );
};

export default IndexPage;
