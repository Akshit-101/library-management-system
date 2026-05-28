import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY

const api = axios.create({
    baseURL: apiUrl,  
    headers: {
        'x-api-key': apiKey
    }
})

export default api