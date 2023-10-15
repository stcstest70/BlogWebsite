import React, {useContext, createContext, useState} from 'react';

const SearchContext = createContext();
export function useSearch() {
    return useContext(SearchContext);
  }
  
  export function SearchProvider({ children }) {
    const [searchString, setSearchString] = useState('');
  
    const setSearch = (search) => {
      setSearchString(search);
    };
  
    return (
      <SearchContext.Provider value={{ searchString, setSearch }}>
        {children}
      </SearchContext.Provider>
    );
  }
