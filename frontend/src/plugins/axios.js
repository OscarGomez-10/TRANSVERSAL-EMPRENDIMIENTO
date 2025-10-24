import axios from "axios"


const api = axios.create({
    baseURL: "https://transversal-emprendimiento-backend.onrender.com/api/veterinaria"
})



export default api
