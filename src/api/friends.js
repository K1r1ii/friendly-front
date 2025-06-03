import { api } from "./axios";

export const friendsAPI = {
    getMyFriends: async () => {
        try {
            const response = await api.get(`/users/friends`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};