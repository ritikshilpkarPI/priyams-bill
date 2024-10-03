import React, { useState } from "react";
import "./pagination.css";
import { RightArrow } from "../rightIcon";

export const Pagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
  paginationIndices,
  setPaginationIndices,
  paginationLength = 6,
  className
}) => {
  
  const handlePagination = (page, idx = 0) => {
    setCurrentPage(page);
    let newArray = [],
      newPageStart = 2;
    if (
      page === paginationIndices[paginationIndices.length - 1] &&
      page < totalPages - 1
    ) {
      newPageStart = totalPages - page < paginationLength ? totalPages - paginationLength : page - 1;
      for (
        let i = 0;
        i < paginationIndices.length && newPageStart < totalPages;
        i++
      ) {
        newArray[i] = newPageStart++;
      }
      setPaginationIndices(newArray);
    } else if (page === paginationIndices[0] && page !== 2) {
      newPageStart = page - 1 < paginationLength ? 2 : page - 4;
      for (let i = 0; i < paginationIndices.length; i++) {
        newArray[i] = newPageStart++;
      }
      setPaginationIndices(newArray);
    }
  };

  const goToNextPage = () => {
    if (currentPage !== totalPages) handlePagination(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage !== 1) handlePagination(currentPage - 1);
  };

  const handleStartIndex = () => {
    setCurrentPage(1);
    if (paginationIndices[0] > 2) {
      const newArray = [];
      for (let i = 0; i < paginationIndices.length; i++) newArray[i] = i + 2;
      setPaginationIndices(newArray);
    }
  };

  const handleEndIndex = () => {
    setCurrentPage(totalPages);
    if (paginationIndices[paginationIndices.length - 1] < totalPages - 1) {
      const newArray = [];
      let newPageStart = totalPages - 6;
      for (let i = 0; i < paginationIndices.length; i++) {
        newArray[i] = newPageStart++;
      }
      setPaginationIndices(newArray);
    }
  };

  return (
    <div className={`pagination-main-container ${className}`}>
      <ul className="pagination-sub-container">
        <li
          className={`pagination-index pagination-button ${
            currentPage === 1 && "disabled"
          }`}
          onClick={goToPrevPage}
        >
          <RightArrow />
        </li>
        <li
          className={`pagination-index ${currentPage === 1 && "selected"}`}
          onClick={handleStartIndex}
        >
          1
        </li>
        <div className="pagination-index-wrapper">
          {paginationIndices.map((page, idx) => (
            <li
              key={idx}
              className={`pagination-index ${currentPage === page && "selected"}`}
              onClick={() => handlePagination(page, idx)}
            >
              {page}
            </li>
          ))}
        </div>
        {totalPages > currentPage && (
          <li
            className={`pagination-index ${
              currentPage === totalPages && "selected"
            }`}
            onClick={handleEndIndex}
          >
            {totalPages}
          </li>
        )}
        <li
          className={`pagination-index pagination-button ${
            currentPage === totalPages && "disabled"
          }`}
          onClick={goToNextPage}
        >
          <RightArrow className="rotate-right-arrow-icon" />
        </li>
      </ul>
    </div>
  );
};
