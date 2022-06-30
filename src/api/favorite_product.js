import axiosClient from "./instances/axiosClient";


const getToFavoriteList = (user_id) => {
    return axiosClient({
        method: "GET",
        url: `/favorite-list/${user_id}`,
    });
}
const addToFavoriteList = (data) => {
    return axiosClient({
        method: "POST",
        url: '/favorite-list/new',
        data,
    });
};

const deleteToFavoriteList = (_id) => {
    return axiosClient({
        method: "DELETE",
        url: `/favorite-list/delete/${_id}`,
    });
};

const API_FAVORITE_LIST = {
    getToFavoriteList,
    addToFavoriteList,
    deleteToFavoriteList
};

export default API_FAVORITE_LIST;
