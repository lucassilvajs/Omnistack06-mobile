import axios from 'axios';

const api = axios.create({
    baseURL: 'https://omnistack06.herokuapp.com/'
});

export default api;