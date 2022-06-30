import axiosClient from "./instances/axiosClient";

const sendEmail = (data) => {
  return axiosClient({
    method: "POST",
    url: `/send-email`,
    data,
  });
};

const SEND_EMAIL = {
  sendEmail,
};

export default SEND_EMAIL;
