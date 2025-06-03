import { api } from "./axios";

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
    }
};