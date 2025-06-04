import { api } from "./axios";  // Импорт твоего axios-инстанса


export const usersAPI = {
    getUserFeedList: async () => {
        try {
          const response = await api.get(`/users/feed/list`);
          console.log("Response full:", response);
          console.log("Response.data:", response.data);
          console.log("Response.data.data:", response.data.data);
          return response.data;
        } catch (error) {
          throw error;
        }
      },
    }