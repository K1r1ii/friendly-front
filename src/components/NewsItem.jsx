import React, { useState, useEffect } from 'react';
import { profileAPI } from '../api/profile';
import { newsAPI } from '../api/news';

import { format } from 'date-fns';
import { Link } from 'react-router-dom';

function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return format(date, 'HH:mm dd.MM.yyyy');
}

export default function NewsItem({ news }) {
  const [author, setAuthor] = useState({});
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reactionLoading, setReactionLoading] = useState(false);

  // Локальное состояние для реакции "LIKE"
  const [likeState, setLikeState] = useState({
    count: 0,
    isLiked: false,
  });

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        const authorData = await profileAPI.getUserProfile(news.post_body.owner_id);
        setAuthor(authorData);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить автора');
        console.error('Ошибка загрузки автора:', err);
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
        setError(err.message || 'Не удалось загрузить фото');
        console.error('Ошибка загрузки фото:', err);
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
    setReactionLoading(true);

    const prevIsLiked = likeState.isLiked;
    const prevCount = likeState.count;

    // Обновляем UI сразу
    setLikeState(prev => ({
      count: prev.isLiked ? prev.count - 1 : prev.count + 1,
      isLiked: !prev.isLiked,
    }));

    try {
      await newsAPI.addReaction(news.post_body.news_id, reactionType);
    } catch (err) {
      // Откатываем изменения при ошибке
      setLikeState({
        count: prevCount,
        isLiked: prevIsLiked,
      });

      setError(err.message || 'Не удалось обновить реакцию');
      console.error('Ошибка добавления реакции:', err);
    } finally {
      setReactionLoading(false);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="card mb-4 shadow-sm">
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

          {/* Кнопка с реакцией и количеством */}
          <button
            className={`btn btn-sm d-flex align-items-center gap-1 ${
              likeState.isLiked ? 'btn-danger' : 'btn-outline-danger'
            }`}
            onClick={() => handleAddReaction('LIKE')}
            disabled={reactionLoading}
          >
            {reactionLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <>
                <span>❤️</span>
                {likeState.count > 0 && <span>{likeState.count}</span>}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}