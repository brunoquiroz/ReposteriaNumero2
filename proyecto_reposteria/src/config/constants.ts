// Detectar si estamos en desarrollo local o accediendo desde la red
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// URL base del API - siempre usar SeeNode
export const API_BASE_URL = 'https://up-de-fra1-mysql-1.db.run-on-seenode.com:11550';
export const API_URL = `${API_BASE_URL}/api`;

// Para debugging
console.log('Hostname:', window.location.hostname);
console.log('Using API URL:', API_URL);