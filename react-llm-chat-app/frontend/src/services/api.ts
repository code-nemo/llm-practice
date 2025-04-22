import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Adjust the base URL as needed

export const chatWithLLM = async (model: string, message: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${model}/chat`, { message });
        return response.data;
    } catch (error) {
        console.error('Error chatting with LLM:', error);
        throw error;
    }
};

export const getAvailableModels = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/models`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available models:', error);
        throw error;
    }
};