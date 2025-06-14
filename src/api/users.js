import { api } from "./axios";  // Импорт твоего axios-инстанса

export const  usersAPI = {
    getUserFeedList: async () => {
        try {
          const response = await api.get(`/users/feed/list`);
          return response.data;
        } catch (error) {
          throw error;
        }
      },

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
            const response = await api.get(`/users/friend/incoming_friend_requests?offset=${offset}&limit=${limit}`, {
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
    },

    getAllMyFriends: async () => {
        try {
          let limit = 49;
          let i = 0;
          let allFriends = [];

          let friends = await usersAPI.getMyFriends(i, limit + 1);
          let friendsArray = Object.values(friends);
          allFriends.push(...friendsArray);

          while (friendsArray.length > limit) {
            i++;
            friends = await usersAPI.getMyFriends(i, limit + 1);
            friendsArray = Object.values(friends);
            allFriends.push(...friendsArray);
          }

          return allFriends;
          } catch (error) {
              throw error;
          }
    },

    isUserFriend: async (otherUserId) => {
      try {
      const allFriends = await usersAPI.getAllMyFriends();
      const friendIds = new Set(allFriends.map(friend => friend.friend_id));
      return friendIds.has(otherUserId);
      } catch (error) {
          throw error;
      }
    },

    countUserFriends: async (otherUserId) => {
        try {
        const allFriends = await usersAPI.getAllMyFriends();
        return allFriends.length;
        } catch (error) {
            throw error;
        }
    },
    
    countRequestsFriend: async () => {
        try {
        let limit = 49;
        let i = 0;
        let friends = await usersAPI.getFriendRequests(i, limit+1);
        let friendsArray = Object.values(friends);
        let res = friendsArray.length;

        while (friendsArray.length > limit){
             i++;
             friends = await usersAPI.getFriendRequests(i, limit+1);
             friendsArray = Object.values(friends);
             res += friendsArray.length;
        }
        return res;
        } catch (error) {
            throw error;
        }
    }
};
