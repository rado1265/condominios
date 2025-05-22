// src/config.ts
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// IMPORTANT: Use environment variables for API keys and secrets in a real application
export const firebaseConfig = {
    apiKey: "AIzaSyAGLBDs0MOUKRBrVxIp0ai7aygveSRHKkA",
    authDomain: "conexionresidencialapp.firebaseapp.com",
    projectId: "conexionresidencialapp",
    storageBucket: "conexionresidencialapp.firebasestorage.app",
    messagingSenderId: "1047153246562",
    appId: "1:1047153246562:web:233d121eafee71fb95ec3b",
    measurementId: "G-54LZY2M3BN"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const CRYPTO_SECRET = "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79";
