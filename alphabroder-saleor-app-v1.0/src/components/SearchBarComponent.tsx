import React, { useState, ChangeEvent } from "react";
import { Box, Input, Button } from "@saleor/macaw-ui";
import styles from "../styles/Header.module.css";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBarComponent: React.FC<{ onSearch: (term: string) => void }> = ({
    onSearch,
  }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
  
    const handleSearch = () => {
      onSearch(searchTerm);
    };
  
    return (
      <div className={styles.searchContainer}>
        <Input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch} className={styles.searchButton}>
          Search
        </Button>
      </div>
    );
  };

export default SearchBarComponent;
