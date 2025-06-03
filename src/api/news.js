import { api } from "./axios";
import { friendsAPI } from "./friends";

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
    getNews: async () => {
        try {
            const friends = await friendsAPI.getMyFriends();
            console.log(friends);
            
            const newsPromises = friends.map(async (friend) => {
                const userId = friend.friend_id;
                return await newsAPI.getUserNews(userId);
            });
    
            const newsArrays = await Promise.all(newsPromises);
            const allNews = newsArrays.flat();

            allNews.sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return dateB - dateA;
            });
    
            return allNews;
    
        } catch (error) {
            throw error;
        }
    }
};