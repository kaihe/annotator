import axios from 'axios'

export const ajax = axios.create({
  baseURL: '/api',
  method: 'post',
  timeout: 30000
});
(window as any).ajax = ajax
