import { api } from "./axios";

export const profileAPI = {
    getMyProfile: async () => {
        try {
            const response = await api.get(`/profile/get_information`, {
                params: {t: Date.now()},
              });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUserProfile: async (userId) => {
        try {
            const response = await api.get(`/profile/get_information?other_usr_id=${userId}`, {
                params: {t: Date.now()},
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateProfile: async (data) => {
        try {
            const response = await api.patch("/profile/update_information", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteProfile: async () => {
        try {
            const response = await api.delete("/profile/delete_account");
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};