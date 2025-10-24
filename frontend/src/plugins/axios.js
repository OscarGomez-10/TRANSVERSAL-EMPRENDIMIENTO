import axios from "axios"


const api = axios.create({
    baseURL: "http://localhost:5000/api/veterinaria"
})



export default api