import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... existing code ...