import React from "react";
import { Link } from "react-router-dom";

export default function FriendsTabs({ currentTab }) {
  return (
  <div className="friends-tabs-wrapper">
    <div className="friends-tabs-panel">
      <div className="friends-tabs">
        <Link
          to="?tab=friends"
          className={`tab-button ${currentTab === "friends" ? "active" : ""}`}
        >
          My Friends
        </Link>
        <Link
          to="?tab=requests"
          className={`tab-button ${currentTab === "requests" ? "active" : ""}`}
        >
          Friend Requests
        </Link>
      </div>
    </div>
  </div>
);
}
