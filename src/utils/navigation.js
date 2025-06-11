const updateSearchParams = (params, userId) => {
    const newParams = {};

    // Добавляем только те параметры, которые нужны по условиям
    if (params.whose_friends_usr_id && params.whose_friends_usr_id !== userId) {
      newParams.whose_friends_usr_id = params.whose_friends_usr_id;
    }

    if (params.offset && params.offset !== 0) {
      newParams.offset = params.offset;
    }

    // Вкладку добавляем только если смотрим свои друзья
    if (params.tab && (params.whose_friends_usr_id === userId || !params.whose_friends_usr_id)) {
      newParams.tab = params.tab;
    }

    if (params.other_usr_id && params.other_usr_id !== userId) {
      newParams.other_usr_id = params.other_usr_id;
    }

    return newParams;
};

export default updateSearchParams;