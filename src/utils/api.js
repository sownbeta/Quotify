import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  withCredentials: true,
  timeout: 10000,
});

// Hàm gọi API gọn hơn
export function api(path, options = {}) {
  return instance({ url: path, ...options })
    .then(res => res.data)
    .catch(err => { throw err.response?.data || err; });
}

export default instance;
