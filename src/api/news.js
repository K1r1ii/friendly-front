import { api } from "./axios";
import { usersAPI } from "./users";

export const newsAPI = {
    getMyNews: async () => {
        try {
            const response = await api.get(`/news/feed/list`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getUserNews: async (userId) => {
        try {
            const response = await api.get(`/news/feed/list?usr_id=${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getFullNewsData: async (news_id) => {
        try {
            const response = await api.get(`/news/feed/${news_id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getNews: async () => {
        try {
            const friends = await usersAPI.getMyFriends();
            
            const newsPromises = friends.map(async (friend) => {
                const userId = friend.friend_id;
                return await newsAPI.getUserNews(userId);
            });
    
            const newsArrays = await Promise.all(newsPromises);
            const allNews = newsArrays.flat(); // список с краткой инфой по всем постам юзера

            allNews.sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return dateB - dateA;
            });
            const news_full = allNews.map(async (news) => {
                const news_id = news.news_id;
                return await newsAPI.getFullNewsData(news_id);
            });
            return await Promise.all(news_full);
    
        } catch (error) {
            throw error;
        }
    },
    createNews: async (data) => {
        try {
            const response = await api.post(`/news/produce_content`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    addReaction: async (news_id, reaction_type) => {
        try {
            const response = await api.post(`/news/add_reaction/${news_id}?reaction_type=${reaction_type}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};