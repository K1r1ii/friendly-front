import { api } from "./axios";

export const notifyAPI = {
  connectToFirebase: async (deviceToken) => {
    const response = await api.post("/notify/connect-to-firebase", {
      device_token: deviceToken,
    });
    return response.data;
  },
};
