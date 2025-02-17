'use client';
import React, { useState, useEffect } from 'react';
import fetchUniqueValues from '@/features/apiCalls/fetchUniqueValues';
import { Filters, FiltringValues } from '@/types/types';
import ErrorReporter from '@/components/Announcer';
import { SearchContext } from '@/app/katalog/context';
import Cookies from 'js-cookie';

const CatalogContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpenSearcher, setOpenSearcher] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    author: [],
    category: [],
    genres: [],
    formaturita: false,
    available: false,
    name: null,
    new: false,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterValues, setFiltersValues] = useState<FiltringValues>({
    genres: [],
    category: [],
    author: [],
    name: [],
  });

  async function fetchUniqueFilterCol(colName: 'genres' | 'category' | 'author' | 'name') {
    const res = await fetchUniqueValues(colName);
    // console.log('fetch unique vals:', colName, res);
    setFiltersValues((prevFilters: FiltringValues) => ({
      ...prevFilters,
      [colName]: res,
    }));
  }

  useEffect(() => {
    async function update() {

      try {
        await Promise.all([
          fetchUniqueFilterCol('genres'),
          fetchUniqueFilterCol('category'),
          fetchUniqueFilterCol('author'),
          fetchUniqueFilterCol('name'),
        ]);
        const savedActiveFilters = Cookies.get('activeFilters');
        console.log('saved state:', savedActiveFilters);
        if (savedActiveFilters) {
          const parsedState = JSON.parse(savedActiveFilters);
          console.log('parsed state:', parsedState);
          setActiveFilters( parsedState);
        }
      } catch (error) {
        setErrorMessage('Failed to load books.');
      }
    }
    update();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      Cookies.remove('activeFilters');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleActiveFilterChange = (filterName: keyof Filters, value: string | boolean | null) => {
    console.log(filterName, value);
    const makeNewFilters = () => {
      if ((typeof value === 'boolean' || value === null) && !Array.isArray(activeFilters[filterName])) {
        return {
          ...activeFilters,
          [filterName]: !value ? null : value,
        };
      }
      if (Array.isArray(activeFilters[filterName])) {
        const arrayValue = activeFilters[filterName] as string[];
        if (typeof value === 'boolean' || value === null || value === undefined) {
          console.error('value has unexpected value: ' + value);
          return {
            ...activeFilters,
            [filterName]: [],
          };
        }

        if (!arrayValue.includes(value)) {
          return {
            ...activeFilters,
            [filterName]: [...arrayValue, value],
          };
        } else {
          return activeFilters;
        }
      } else {
        return {
          ...activeFilters,
          [filterName]: value,
        };
      }
    };
    const newFilters = makeNewFilters();
    setActiveFilters(newFilters);
    Cookies.set('activeFilters', JSON.stringify(newFilters));
    const active = Cookies.get('activeFilters' );
    console.log('active filters:', active );
  };

  if (errorMessage) {
    return <ErrorReporter message={errorMessage} type="error" />;
  }

  return (
    <SearchContext.Provider
      value={{
        isOpenSearcher,
        setOpenSearcher,
        activeFilters,
        setActiveFilters,
        errorMessage,
        setErrorMessage,
        filterValues,
        setFiltersValues,
        handleActiveFilterChange,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default CatalogContextProvider;