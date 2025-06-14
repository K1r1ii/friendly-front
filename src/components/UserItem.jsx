import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usersAPI } from "../api/users";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function UserItem({ id, user, tab, onRemove, onAccept,
//     onAdd
}) {
  const [isFriend, setIsFriend] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
      const checkFriendStatus = async () => {
        const res = await usersAPI.isUserFriend(id);
        setIsFriend(res);
      };
      checkFriendStatus();
  }, [id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 1, rotate: 0, y: 100 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.1
        }
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        rotate: -5,
        y: 50,
        transition: {
          duration: 0.3,
          ease: "easeInOut"
        }
      }}
      className="user-item p-3 rounded"
    >
    <div className={`card mb-3 text-white border-0 friend-card`}>
      <div className="card-body d-flex flex-lg-row flex-column align-items-lg-center align-items-start gap-2 position-relative overflow-hidden">
        {/* Левая часть — аватар и текст */}
        <div className="d-flex align-items-center">
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
                to={`/profile?other_usr_id=${id}`}
                className="text-decoration-none friend-name"
              >
                {user.first_name} {user.last_name || ""}
              </Link>
            </h5>
            <p className="mb-0 text-muted">@{user.nickname}</p>
          </div>
        </div>

        {/* Панель действия */}
        {tab && (
          <div className="remove-panel ms-lg-auto">
            {tab === "friends" && (
              <button
                className="btn btn-sm remove-btn"
                onClick={() => onRemove(id)}
                title="Удалить из друзей"
              >
                ×
              </button>
            )}
            {tab === "requests" && (
              <button
                className="btn btn-sm accept-btn"
                onClick={() => onAccept(id)}
                title="Принять в друзья"
              >
                ✓
              </button>
            )}
          </div>
        )}

        {/* Надпись FRIEND или YOU */}
        {(isFriend || id === userData.id) && !tab && (
          <div className="already-friends-label ms-lg-auto">
            <span className="friend-status">
              {id === userData.id ? "YOU" : "FRIEND"}
            </span>
          </div>
        )}
      </div>
    </div>
    </motion.div>
  );
}

{/*             {!tab && ( */}
{/*               <button */}
{/*                 className="btn btn-sm accept-btn" */}
{/*                 onClick={() => onAdd(user.id)} */}
{/*                 title="Добавить в друзья" */}
{/*               > */}
{/*                 + */}
{/*               </button> */}
{/*             )} */}
