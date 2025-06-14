import React, { useState, useEffect } from 'react';
import { profileAPI } from '../api/profile';
import { newsAPI } from '../api/news';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useError } from "../context/ErrorContext";

function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return format(date, 'HH:mm dd.MM.yyyy');
}

export default function NewsItem({ news, onNewsDeleted }) {
  const [author, setAuthor] = useState({});
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [reactionLoading, setReactionLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { setErrorCode, setErrorMessage } = useError();

  // Локальное состояние для реакции "LIKE"
  const [likeState, setLikeState] = useState({
    count: 0,
    isLiked: false,
  });

  // Получаем данные текущего пользователя
  const { userData } = useAuth();
  const isAuthor = news?.post_body?.owner_id === userData?.id;

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        const authorData = await profileAPI.getUserProfile(news.post_body.owner_id);
        setAuthor(authorData);
      } catch (err) {
        handleApiErrors(err, setErrorCode, setErrorMessage);
      } finally {
        setLoading(false);
      }
    };

    const fetchImage = async () => {
      try {
        if (news.attachments?.length > 0) {
          const imageUrl = news.attachments[0].link_to_file;
          setImage(imageUrl);
        }
      } catch (err) {
        handleApiErrors(err, setErrorCode, setErrorMessage);
      }
    };

    // Инициализация лайка из пропсов
    const reaction = news.reactions?.find(r => r.type === 'LIKE') || {
      count: 0,
      reacted_by_user: false,
    };
    setLikeState({
      count: reaction.count,
      isLiked: reaction.reacted_by_user,
    });

    fetchAuthor();
    fetchImage();
  }, [news]);

  const handleAddReaction = async (reactionType) => {
    if (likeState.isLiked || reactionLoading) return;
    // setReactionLoading(true);

    const prevIsLiked = likeState.isLiked;
    const prevCount = likeState.count;

    setLikeState({
      count: prevCount + 1,
      isLiked: true,
    });

    try {
      await newsAPI.addReaction(news.post_body.news_id, reactionType);
    } catch (err) {
      setLikeState({
        count: prevCount,
        isLiked: prevIsLiked,
      });

      handleApiErrors(err, setErrorCode, setErrorMessage);
    } finally {
    }
  };
  const handleDeleteNews = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      return;
    }

    setDeleteLoading(true);

    try {
      await newsAPI.deleteNews(news.post_body.news_id);

      if (onNewsDeleted) {
        onNewsDeleted(news.post_body.news_id);
      }
    } catch (err) {
      handleApiErrors(err, setErrorCode, setErrorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="card mb-4 shadow-sm">
      {/* Блок с ошибкой удаления */}

      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">{news.post_body.topic}</h5>
          <small className="text-muted">{formatDateTime(news.post_body.created_at)}</small>
        </div>

        <p className="card-text">{news.post_body.main_text}</p>

        {image && image.trim() !== '' && (
          <div className="mb-3">
            <img
              src={image}
              alt="Изображение новости"
              className="img-fluid rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="d-flex align-items-center">
            <img
              src="/emblem_logo.png"
              alt="Автор"
              className="rounded-circle me-2"
              width="32"
              height="32"
            />
            <Link to={`/profile?other_usr_id=${author.id}`} className='text-decoration-none'>
              <small className="text-muted">
                @{author.firstName ? author.firstName : author.nickname}
              </small>
            </Link>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Кнопка с реакцией и количеством */}
            <button
              className={`btn d-flex align-items-center gap-1 ${
                likeState.isLiked ? 'btn-dark' : 'btn-outline-dark'
              }`}
              onClick={() => handleAddReaction("LIKE")}
            >
              {reactionLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <>
                    {/* Условный рендеринг символа сердечка */}
                    {likeState.isLiked ? <img src="https://img.icons8.com/?size=30&id=7697&format=png&color=f24444" /> : <img src="https://img.icons8.com/?size=30&id=87&format=png&color=ffffff"/>}

                  {/* Отображаем количество лайков, если оно больше 0 */}
                  {likeState.count > 0 && (
                    <span style={{ color: '#f24444' }}>{likeState.count}</span>
                  )}
                </>
              )}
            </button>
            {/* Кнопка удаления (отображается только автору) */}
            {isAuthor && (
              <button
                className="btn btn-outline-danger"
                onClick={handleDeleteNews}
                disabled={deleteLoading}
                title="Удалить пост"
              >
                {deleteLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}