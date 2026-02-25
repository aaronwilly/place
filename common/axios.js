import axios from 'axios';

export const axiosInstance = () => {
  let accessToken = '';
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken')
  }

  const axiosInstance = axios.create();
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // if (error.response && error.response.status === 401) {
      //   window.location.href = '/';
      // }
      // if (error.response && error.response.status === 403) {
      //   window.location.href = '/';
      // }
      return error
    }
  );

  return axiosInstance
}
