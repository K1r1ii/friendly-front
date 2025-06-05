import { api } from "./axios";

export const  usersAPI = {
    getMyFriends: async (offset=0, limit=10) => {
        try {
            const response = await api.get(`/users/friends?offset=${offset}&limit=${limit}`, {
               params: {t: Date.now()},
             });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getUserFriends: async(userId, offset=0, limit=10) => {
        try {
            const response = await api.get(`/users/friends?whose_friends_usr_id=${userId}&offset=${offset}&limit=${limit}`, {
              params: {t: Date.now()},
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    removeFriend: async (friendId) => {
        try {
            const response = await api.delete(`/users/friend/remove/${friendId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    addFriend: async (friendId) => {
        try {
            const response = await api.post(`/users/friend/add/${friendId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    banUser: async (userId) => {
        try {
            const response = await api.put(`/users/ban_user/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getFriendRequests: async (offset=0, limit=10) => {
        try {
            const response = await api.get(`/users/friend/incoming_friend_requests`, {
              params: {t: Date.now()},
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    acceptFriend: async (friendId) => {
        try {
            const response = await api.patch(`/users/friend/accept/${friendId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};