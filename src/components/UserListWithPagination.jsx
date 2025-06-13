import React from "react";
import UserItem from "./UserItem";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

export default function UserListWithPagination({
  users,
  offset,
  hasMore,
  emptyIcon,
  emptyTitle,
  emptyText,
  tab,
  keyProp,
  LIMIT,
  onRemove,
  onAccept,
}) {
    const queryParams = new URLSearchParams(location.search);
    const currentPage = Math.ceil(offset/LIMIT);

    const getPageLink = (newPage) => {
        const newParams = new URLSearchParams(queryParams);
        if (newPage === 0) {
          newParams.delete("offset");
        } else {
          newParams.set("offset", newPage);
        }
        return `${location.pathname}?${newParams.toString()}`;
    };

  if (users.length === 0) {
    return (
      <div className="card shadow text-center py-5 mb-4">
        <div className="card-body">
          <i className={`bi ${emptyIcon} display-1 text-muted mb-4`} />
          <h3 className="card-title">{emptyTitle}</h3>
          <p className="card-text">{emptyText}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {users.map((user) => (
          <UserItem
            key={user[keyProp]}
            id={user[keyProp]}
            user={user}
            onRemove={onRemove}
            onAccept={onAccept}
            tab={tab}
          />
        ))}
      </AnimatePresence>
      <div className="d-flex justify-content-between align-items-center mt-4 mb-5">
          {currentPage > 0 && (
            <Link className="pagination-btn" to={getPageLink(Math.max(currentPage - 1, 0))}>
              ← Previous
            </Link>
          )}
          <div className="flex-grow-1" />
          {hasMore && (
            <Link className="pagination-btn" to={getPageLink(currentPage + 1)}>
              Next →
            </Link>
          )}
      </div>
    </>
  );
}
