import {SearchIcon} from "@/components/ui/icons/SearchIcon";
import {useState} from "react";
import styles from './SearchInput.module.scss';

const SearchInput = () => {

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return <form className={styles.searchForm} onSubmit={handleSearch}>
    <input
      type="text"
      placeholder="Издөө..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className={styles.searchInput}
    />
    <button type="submit" className={styles.searchSubmit}>
      <SearchIcon/>
    </button>
  </form>
}
export default SearchInput;