import axiosClient from "./instances/axiosClient";

const getMessenger = (data) => {
    return axiosClient({
        method: "POST",
        url: `/messenger`,
        data,
    });
}

const createMessenger = (data) => {
    return axiosClient({
        method: "POST",
        url: `/messenger/send`,
        data,
    });
}

const initCreateMessenger = (data) => {
    return axiosClient({
        method: "POST",
        url: `/messenger/init-messenger`,
        data,
    });
}


const CHAT_MESSENGER = {
    getMessenger, createMessenger, initCreateMessenger
};

export default CHAT_MESSENGER;
