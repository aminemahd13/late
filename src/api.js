import axios from 'axios';

const ax = axios.create({
  baseURL: '//localhost:3000/api/',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default ax;
