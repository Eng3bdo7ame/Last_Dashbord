'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { CaretLeft, CaretRight, Eye, Plus, MagnifyingGlass, Trash } from '@phosphor-icons/react';

const PaginationControls = ({ currentPage, totalPages, paginate }) => (
  <div className="flex justify-end items-center p-4 gap-4">
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className="flex items-center gap-2 text-gray-500"
    >
      <CaretLeft size={18} weight="bold" />
    </button>
    <div className="space-x-2 hidden md:block">
      {Array.from({ length: Math.min(6, totalPages) }, (_, i) => {
        const page = Math.floor((currentPage - 1) / 6) * 6 + i + 1;
        return (
          page <= totalPages && (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-4 py-2 text-sm rounded-md ${page === currentPage
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-500'
                }`}
            >
              {page}
            </button>
          )
        );
      })}
    </div>
    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="flex items-center gap-2 text-gray-500"
    >
      <CaretRight size={18} weight="bold" />
    </button>
  </div>
);

const Table = ({ data, headers, openCreate, openPreview, onDelete, addItemLabel }) => {
  const dropdownRefs = useRef({});
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 10;

  if (!Array.isArray(data)) {
    console.error('Expected data to be an array');
    return null;
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleClickOutside = useCallback(
    (event) => {
      if (selectedId !== null) {
        const dropdown = dropdownRefs.current[selectedId];
        if (
          dropdown &&
          !dropdown.contains(event.target) &&
          !event.target.classList.contains('view-button')
        ) {
          setSelectedId(null);
        }
      }
    },
    [selectedId]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [handleClickOutside]);

  const toggleEditDropdown = useCallback((id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      headers.some((header) =>
        String(item[header.key])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data, headers]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border p-2 rounded-md"
          />
          <MagnifyingGlass size={20} className="absolute right-3 top-2 text-gray-500" />
        </div>
        <button
          onClick={() => openCreate('client')}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          <Plus size={20} className="inline mr-2" />
          {addItemLabel}
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {headers.map((header) => (
              <th key={header.key} className="p-4 border-b">{header.label}</th>
            ))}
            <th className="p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {headers.map((header) => (
                  <td key={header.key} className="p-4">{row[header.key]}</td>
                ))}
                <td className="p-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => openPreview(row)}
                    className="text-blue-500"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => toggleEditDropdown(rowIndex)}
                    className="text-gray-500"
                  >
                    <Trash size={20} />
                  </button>
                  {selectedId === rowIndex && (
                    <div ref={el => dropdownRefs.current[rowIndex] = el} className="absolute bg-white shadow-md mt-2 rounded-md">
                      <button
                        onClick={() => openCreate('edit', row)}
                        className="block px-4 py-2 w-full text-left"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(row)}
                        className="block px-4 py-2 w-full text-left text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length + 1} className="p-4 text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
      />
    </div>
  );
};

export default Table;
