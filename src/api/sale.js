import axiosClient from './instances/axiosClient';

const querySales = (queries) => {
  return axiosClient({
    method: 'GET',
    url: `/sales${queries}`,
  });
};

const Sale_API = {
  querySales,
};

export default Sale_API;
