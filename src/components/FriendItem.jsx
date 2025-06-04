import React from "react";
import { Link } from "react-router-dom";

export default function FriendItem({ user }) {
  return (
    <div className="card mb-3 friend-card text-white border-0">
      <div className="card-body d-flex align-items-center">
        <img
          src="/avatar.png"
          alt="Аватар"
          className="rounded-circle me-3"
          width="64"
          height="64"
        />
        <div>
          <h5 className="mb-1">
            <Link
              to={`/profile?other_usr_id=${user.id}`}
              className="text-decoration-none friend-name"
            >
              {user.first_name} {user.last_name || ""}
            </Link>
          </h5>
          <p className="mb-0 text-muted">@{user.nickname}</p>
        </div>
      </div>
    </div>
  );
}
