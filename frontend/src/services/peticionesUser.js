
import api from '../plugins/axios.js';

// Función GET
export async function getData(url) {
    try {
        const response = await api.get(url);
        return response
    } catch (error) {
        console.error('Error en la petición GET:', error);
        throw error;
    }
};

// Función POST
export async function postData(url, data) {
    try {
        const response = await api.post(url, data);

        return response;
    } catch (error) {
        console.error('Error en la petición POST:', error);
        throw error;
    }
}

// Función PUT
export async function putData(url, data) {
    try {
        const response = await api.put(url, data);
        return response
    } catch (error) {
        console.error('Error en la petición PUT:', error);
        throw error;
    }
}

// Función DELETE
export async function deleteData(url) {
    try {
        const response = await api.delete(url);
        return response;
    } catch (error) {
        console.error('Error en la petición DELETE:', error);
        throw error;
    }
}