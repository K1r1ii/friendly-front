import { api } from "./axios";

export const file_storageAPI = {
    getMyFriends: async () => {
        try {
            const response = await api.get(`/users/friends`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    uploadFile: async (file) => {
        try {
            console.log(file);
            const formData = new FormData();
            formData.append("file", file);
            const response = await api.post(`/storage/upload-file`, formData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};