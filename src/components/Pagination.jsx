import React from "react";

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages === 1) return null; // hide if only 1 page

  // page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <li
        key={i}
        className={`page-item ${i === currentPage ? "active" : ""}`}
      >
        <button className="page-link" onClick={() => onPageChange(i)}>
          {i}
        </button>
      </li>
    );
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {/* Previous button */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
        </li>

        {/* Page numbers */}
        {pages}

        {/* Next button */}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
